import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';
import stripePackage from 'stripe';

import { STRIPE_SECRET_KEY, SUPPORT_EMAIL } from '../config';
import {
	PAYMENT_NOT_FOUND,
	PAYMENT_STATUS,
	PACKAGE_NOT_FOUND,
} from '../constants';
import { AppError } from '../errors';
import { notification } from '../utils';

const stripe = stripePackage(STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

export class PaymentService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllPayments() {
		const { query, user } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;

		const options = {
			where: {
				is_deleted: 0,
				...(user.role_id === 1 ? {} : { created_by: user.id }),
			},
		};

		if (search) {
			options.where.AND = Object.keys(search).map(key => ({
				[key]: { contains: search[key] },
			}));
		}
		if (sort) {
			const [field, direction] = sort.split(':');
			options.orderBy = [
				{
					[field]: direction,
				},
			];
		}

		const totalCount = await prisma.payment.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;
		options.include = {
			user: {
				select: {
					name: true,
					email: true,
					image: true,
					verified_status: true,
				},
			},
			user_package: {
				include: {
					package: true,
				},
			},
		};

		const allRecords = await prisma.payment.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(PAYMENT_NOT_FOUND, HttpStatus.NOT_FOUND, allRecords);

		return {
			records: allRecords,
			totalRecords: totalCount,
			totalPages,
			query,
		};
	}

	async getPayment() {
		const { id } = this.req.params;
		const record = await prisma.payment.findUnique({
			where: {
				is_deleted: 0,
				id: parseInt(id, 10),
			},
		});
		if (!record || !record.id)
			throw new AppError(PAYMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
		return record;
	}

	async createPayment() {
		const { body } = this.req;

		const record = await prisma.payment.create({
			data: body,
		});

		return { record };
	}

	async createPaymentIntent() {
		const { body, user } = this.req;
		const { package_id: packageId } = body;

		const packageInfo = await prisma.packages.findUnique({
			where: {
				id: packageId,
				role_id: user.role_id,
			},
		});
		if (!packageInfo || !packageInfo.id)
			throw new AppError(PACKAGE_NOT_FOUND, HttpStatus.NOT_FOUND);

		const total = packageInfo.price;

		let ephemeralKey;
		let paymentIntent;
		let customerId;

		if (total > 0) {
			const userStripeId = await prisma.user_meta.findFirst({
				where: {
					user_id: user.id,
					key: 'stripe_id',
				},
			});
			if (userStripeId && userStripeId?.value) {
				customerId = userStripeId.value;
			} else {
				const customer = await stripe.customers.create({
					name: user.name,
					email: user.email,
				});
				customerId = customer.id;

				await prisma.user_meta.create({
					data: {
						user_id: user.id,
						key: 'stripe_id',
						value: customerId,
					},
				});
			}

			ephemeralKey = await stripe.ephemeralKeys.create(
				{ customer: customerId },
				{ apiVersion: '2024-04-10' },
			);

			paymentIntent = await stripe.paymentIntents.create({
				amount: total * 100,
				currency: 'usd',
				customer: customerId,
				automatic_payment_methods: {
					enabled: true,
				},
				metadata: {
					packageId,
					userId: user.id,
				},
			});
		}

		// const subscription = await stripe.subscriptions.create({
		//     customer: customerId,
		//     items: [{ price: priceId }], // Price ID from Stripe Dashboard
		//     expand: ['latest_invoice.payment_intent'], // Expand for Payment Intent details
		// });

		const payment = await prisma.payment.create({
			data: {
				amount: total,
				status: total > 0 ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.COMPLETED,
				description: paymentIntent?.id ?? null,
				// response: JSON.stringify(paymentIntent) ?? null,
				response: JSON.stringify(packageInfo),
				type: 'user_package',
				created_by: user.id,
			},
		});

		const currentDate = new Date();
		const expiryDate = new Date();
		expiryDate.setDate(currentDate.getDate() + (packageInfo.days ?? 1));

		const userPackage = await prisma.user_package.create({
			data: {
				package_id: packageInfo.id,
				user_id: user.id,
				payment_id: payment.id,
				price: total,
				status: total > 0 ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.COMPLETED,
				expiry: expiryDate,
			},
		});

		await prisma.payment.update({
			where: {
				id: payment.id,
			},
			data: {
				reference_id: userPackage.id,
			},
		});

		return {
			// payment,
			package: userPackage,
			paymentIntent: paymentIntent?.client_secret,
			ephemeralKey: ephemeralKey?.secret,
			customer: customerId,
			paymentIntentId: paymentIntent?.id,
		};
	}

	async confirmPayment() {
		const { body, user } = this.req;
		const { paymentIntentId } = body;

		const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

		if (paymentIntent.status !== 'succeeded')
			throw new AppError(
				`Payment status: ${paymentIntent?.status}`,
				HttpStatus.NOT_FOUND,
			);

		const payment = await prisma.payment.findFirst({
			where: {
				created_by: user.id,
				description: paymentIntentId,
			},
		});
		if (!payment) throw new AppError(PAYMENT_NOT_FOUND, HttpStatus.NOT_FOUND);

		await prisma.payment.update({
			where: {
				id: payment.id,
			},
			data: {
				status: PAYMENT_STATUS.COMPLETED,
			},
		});

		await prisma.user_package.updateMany({
			where: {
				payment_id: payment.id,
			},
			data: {
				status: PAYMENT_STATUS.COMPLETED,
			},
		});

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				verified_status: 'ACTIVE',
			},
		});

		if (user.business_id > 0 && user.role_id === 3) {
			await prisma.business.update({
				where: {
					id: user.business_id,
				},
				data: {
					verified_status: 'ACTIVE',
				},
			});
		}

		const record = await prisma.user_package.findFirst({
			where: {
				payment_id: payment.id,
			},
			include: {
				user: {
					select: {
						name: true,
						email: true,
						image: true,
						verified_status: true,
					},
				},
				package: true,
				payment: true,
			},
		});

		const data = {
			subject: 'Confirmation of Your Package Purchase',
			title: 'Thank You for Your Purchase!',
			name: user.name,
			message: `
			<p>We’re excited to confirm your purchase of the <strong>${record.package.name}</strong>. Here are the details of your transaction:</p>
            <div style="margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #dddddd;">Package Name:</th>
                        <td style="padding: 8px; border-bottom: 1px solid #dddddd;">${record.package.name}</td>
                    </tr>
                    <tr>
                        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #dddddd;">Purchase Date:</th>
                        <td style="padding: 8px; border-bottom: 1px solid #dddddd;">${record.payment.created_at}</td>
                    </tr>
                    <tr>
                        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #dddddd;">Amount Paid:</th>
                        <td style="padding: 8px; border-bottom: 1px solid #dddddd;">${record.payment.amount}</td>
                    </tr>
                    <tr>
                        <th style="text-align: left; padding: 8px; border-bottom: 1px solid #dddddd;">Payment ID:</th>
                        <td style="padding: 8px; border-bottom: 1px solid #dddddd;">${record.payment.id}</td>
                    </tr>
                </table>
            </div>
            <p>If you have any questions, feel free to contact our support team at <a href="mailto:${SUPPORT_EMAIL}" style="color: #4CAF50; text-decoration: none;">${SUPPORT_EMAIL}</a>.</p>
            <p>Thank you for choosing Trusty Feed!</p>`,
		};
		notification(user, 'mail', data, 'rawMessage');

		return record;
	}

	async updatePayment() {
		const { id } = this.req.params;
		const { body } = this.req;

		const updateRecord = await prisma.payment.update({
			where: {
				is_deleted: 0,
				id: parseInt(id, 10),
			},
			data: body,
		});

		return updateRecord;
	}

	async deletePayment() {
		const { id } = this.req.params;

		await prisma.payment.update({
			where: {
				is_deleted: 0,
				id: parseInt(id, 10),
			},
			data: {
				is_deleted: 1,
			},
		});

		return null;
	}

	async deleteManyPayment() {
		const { ids } = this.req.body;

		await prisma.payment.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data: {
				is_deleted: 1,
			},
		});

		return null;
	}
}
