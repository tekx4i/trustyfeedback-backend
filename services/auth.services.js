import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import HttpStatus from 'http-status-codes';

import {
	USER_NOT_FOUND,
	ACCOUNT_STATUS,
	INVALID_CREDENTIALS,
	NOT_ALLOWED_TO_LOGIN,
	ACCOUNT_NOT_ACTIVE,
} from '../constants';
import { AppError } from '../errors';
import {
	createOTP,
	notification,
	createOtpToken,
	createAccessToken,
} from '../utils';

const prisma = new PrismaClient();

export class AuthService {
	constructor(req) {
		this.req = req;
	}

	async login() {
		const { email, password, role } = this.req.body;

		const user = await prisma.user.findFirst({
			where: {
				deleted: false,
				email,
				// status: ACCOUNT_STATUS.ACTIVE,
			},
			include: {
				business: true,
			},
		});

		if (!user || !user.id)
			throw new AppError(USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid)
			throw new AppError(INVALID_CREDENTIALS, HttpStatus.LOCKED);

		if (role && role !== user.role)
			throw new AppError(NOT_ALLOWED_TO_LOGIN, HttpStatus.FORBIDDEN);

		if (user.status !== ACCOUNT_STATUS.ACTIVE)
			throw new AppError(ACCOUNT_NOT_ACTIVE, HttpStatus.BAD_REQUEST, {
				id: user.id,
			});

		await prisma.auth_log.create({
			data: {
				user_id: user.id,
				type: 'login',
			},
		});

		const updateRecord = this.publicProfile(user);

		notification(updateRecord, 'app', { message: 'Login successful' });

		updateRecord.package = await prisma.user_package.findFirst({
			where: {
				user_id: user.id,
				status: 'COMPLETED',
			},
			orderBy: [
				{
					id: 'desc',
				},
			],
		});

		if (
			updateRecord.package &&
			new Date(updateRecord.package.expiry) < new Date()
		) {
			await prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					verified_status: 'PENDING',
				},
			});

			updateRecord.verified_status = 'PENDING';

			if (user.business_id > 0 && user.role_id === 3) {
				await prisma.business.update({
					where: {
						id: user.business_id,
					},
					data: {
						verified_status: 'PENDING',
					},
				});
			}
		}

		return {
			accessToken: createAccessToken({ id: user.id }),
			user: updateRecord,
		};
	}

	async register() {
		const { body, user } = this.req;
		const {
			password,
			business_name: name,
			business_address: address,
			business_phone: phone,
			business_website: website,
			business_categories: categories,
			business_description: description,
			...insertData
		} = body;

		const passwordHash = await bcrypt.hash(password, 12);
		let business;

		if (body.role_id === 3) {
			business = await prisma.business.create({
				data: {
					name,
					address,
					phone,
					website,
					email: insertData.email,
					...(description ? { description } : {}),
					...(insertData?.lat_long ? { lat_long: insertData.lat_long } : {}),
					...(insertData?.postal_code
						? { postal_code: insertData.postal_code }
						: {}),
					...(insertData?.city ? { city: insertData.city } : {}),
					...(insertData?.country ? { country: insertData.country } : {}),
				},
			});
			const businessCategories = categories.map(categId => ({
				business_id: business.id,
				category_id: categId,
			}));

			await prisma.business_category.createMany({
				data: businessCategories,
			});
		}

		const newUser = await prisma.user.create({
			data: {
				password: passwordHash,
				status: ACCOUNT_STATUS.PENDING,
				...(user?.id > 0 ? { created_by: user.id } : {}),
				...(business && business.id ? { business_id: business.id } : {}),
				...insertData,
			},
		});
		// const updateRecord = this.publicProfile(newUser);
		const updateRecord = await createOTP(newUser.id, 'verify');

		const data = {
			subject: 'Welocme to Trusty Feedback',
			name: updateRecord.name,
			...(updateRecord.role_id === 3 ? { businessName: name } : {}),
		};
		const template = updateRecord.role_id === 3 ? 'welcomeBusiness' : 'welcome';
		notification(updateRecord, 'mail', data, template);
		notification(updateRecord, 'app', { message: 'Welcome to Trusty Feed' });

		return this.publicProfile(updateRecord);
	}

	async getLoggedInUser() {
		const { user } = this.req;
		const record = await prisma.user.findUnique({
			where: { id: user.id },
			include: {
				business: true,
				badge: true,
			},
		});

		record.reviews_count = await prisma.review.count({
			where: {
				deleted: false,
				...(record.role_id === 3
					? {
							business_id: record.business_id,
							status: 'ACTIVE',
							approved: true,
						}
					: { user_id: user.id }),
			},
		});

		record.total_likes = await prisma.like.count({
			where: {
				review: {
					deleted: false,
					...(record.role_id === 3
						? {
								business_id: record.business_id,
								status: 'ACTIVE',
								approved: true,
							}
						: { user_id: user.id }),
				},
			},
		});

		record.total_comments = await prisma.comment.count({
			where: {
				author_id: user.id,
				review: {
					deleted: false,
					...(record.role_id === 3
						? {
								business_id: record.business_id,
								status: 'ACTIVE',
								approved: true,
							}
						: { user_id: user.id }),
				},
			},
		});

		record.package = await prisma.user_package.findFirst({
			where: {
				user_id: user.id,
				status: 'COMPLETED',
			},
			orderBy: [
				{
					id: 'desc',
				},
			],
		});

		if (record.package && new Date(record.package.expiry) < new Date()) {
			await prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					verified_status: 'PENDING',
				},
			});

			record.verified_status = 'PENDING';
		}

		return this.publicProfile(record);
	}

	async OtpVerify() {
		const { type } = this.req;
		const { id } = this.req.params;
		let updateData;
		let rememberToken;
		let updateRecord;

		if (type === 'reset') {
			rememberToken = createOtpToken({ userId: id, type });
			updateData = { remember_token: rememberToken };
		} else if (type === 'verify') {
			updateData = { status: ACCOUNT_STATUS.ACTIVE, remember_token: null };
		} else {
			updateData = { remember_token: null };
		}

		updateRecord = await prisma.user.update({
			where: { id: parseInt(id, 10) },
			data: updateData,
		});
		updateRecord = this.publicProfile(updateRecord);

		if (type === 'reset' && rememberToken) {
			updateRecord.resetToken = rememberToken;
		} else if (type === 'verify') {
			const data = {
				subject: 'Email Verified',
				name: updateRecord.name,
				message:
					'Your email has been successfully verified. Thank you for confirming your email address.',
			};
			notification(updateRecord, 'mail', data);
			notification(updateRecord, 'app', {
				message: 'Email verified successfully',
			});
		}

		return updateRecord;
	}

	async ResendOTP() {
		const { id } = this.req.params;
		const { query } = this.req;
		const type = query?.type ? query.type : 'verify';

		const updateRecord = await createOTP(id, type);

		return this.publicProfile(updateRecord);
	}

	async ForgotPassword() {
		const { email } = this.req.body;

		const record = await prisma.user.findFirst({
			where: {
				deleted: false,
				email,
			},
		});

		const updateRecord = await createOTP(record.id, 'reset');

		return this.publicProfile(updateRecord);
	}

	async ResetPassword() {
		const { password } = this.req.body;
		const { user } = this.req;

		const passwordHash = await bcrypt.hash(password, 12);

		const updateRecord = await prisma.user.update({
			where: {
				id: parseInt(user.id, 10),
			},
			data: {
				password: passwordHash,
				remember_token: null,
			},
		});

		return this.publicProfile(updateRecord);
	}

	/* eslint-disable-next-line class-methods-use-this */
	publicProfile(user) {
		const record = { ...user };
		if (!record || !record.id)
			throw new AppError(USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		if (record.password) delete record.password;
		if (record.remember_token) delete record.remember_token;

		return record;
	}
}
