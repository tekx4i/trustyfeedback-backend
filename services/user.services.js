import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import HttpStatus from 'http-status-codes';

import { USER_NOT_FOUND, ACCOUNT_STATUS, PAYMENT_STATUS } from '../constants';
import { FRONTEND_URL, ADMIN_URL, SUPPORT_EMAIL } from '../config';
import { AppError } from '../errors';
import { generateRandomString } from '../utils';

const prisma = new PrismaClient();

export class UserService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllUsers() {
		const { query, user } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, role_id, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;

		const options = {
			where: {
				deleted: false,
				...(role_id ? { role_id: parseInt(role_id, 10) } : {}),
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
		if (user.role_id === 1) {
			options.where.AND.push({
				id: {
					notIn: [user.id],
				},
			});
		}

		const totalCount = await prisma.user.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;
		options.select = {
			id: true,
			name: true,
			email: true,
			password: false,
			birth_date: true,
			gender: true,
			remember_token: false,
			role_id: true,
			roles: {
				select: {
					id: true,
					name: true,
					description: true,
				},
			},
			business: {
				select: {
					id: true,
					name: true,
				},
			},
			status: true,
			deleted: true,
			created_by: true,
			created_at: true,
			updated_at: true,
			last_login: true,
			address: true,
			city: true,
			country: true,
			image: true,
			state: true,
			number: true,
			lat_long: true,
			postal_code: true,
		};

		const allRecords = await prisma.user.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		return {
			records: allRecords,
			totalRecords: totalCount,
			totalPages,
			query,
		};
	}

	async getAllUserPackages() {
		const { query, user } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;

		const options = {
			where: {
				...(user.role_id === 1 ? {} : { user_id: user.id }),
			},
		};
		if (search) {
			options.where.AND = Object.keys(search).map(key => {
				if (key === 'package_id' || key === 'user_id' || key === 'payment_id') {
					return { [key]: search[key] };
				}
				return { [key]: { contains: search[key] } };
			});
		}
		if (sort) {
			const [field, direction] = sort.split(':');
			options.orderBy = [
				{
					[field]: direction,
				},
			];
		}

		const totalCount = await prisma.user_package.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;
		options.include = {
			user: {
				select: {
					id: true,
					name: true,
					image: true,
				},
			},
			package: true,
			payment: {
				select: {
					id: true,
					amount: true,
					status: true,
					type: true,
					created_at: true,
					updated_at: true,
				},
			},
		};

		const allRecords = await prisma.user_package.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		return {
			records: allRecords,
			totalRecords: totalCount,
			totalPages,
			query,
		};
	}

	async getUser() {
		const { id } = this.req.params;
		const record = await prisma.user.findUnique({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			include: {
				roles: true,
				business: {
					include: {
						categories: true,
					},
				},
			},
		});
		return this.publicProfile(record);
	}

	async createUser() {
		const { body, user } = this.req;
		/* eslint-disable prefer-const */
		let {
			password,
			business_name: name,
			business_address: address,
			business_phone: phone,
			business_website: website,
			business_categories: categories,
			...insertData
		} = body;

		if (!password) {
			password = generateRandomString(6, 20);
		}
		const passwordHash = await bcrypt.hash(password, 12);

		let business;

		if (body.role_id === 3) {
			business = await prisma.business.create({
				data: {
					name,
					address,
					phone,
					website,
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
				status: ACCOUNT_STATUS.ACTIVE,
				created_by: user.id,
				...(business && business.id ? { business_id: business.id } : {}),
				...insertData,
			},
		});

		const loginUrl = newUser.role_id === 1 
			? `${ADMIN_URL}/login` 
			: newUser.role_id === 2 
			? `${FRONTEND_URL}/auth/login` 
			: newUser.role_id === 3 
			? `${FRONTEND_URL}/business/log-in` 
			: "";

		const data = {
			subject: 'Welcome to Trusty Feedback - Your Account Details',
			name: newUser.name,
			message: `We are excited to inform you that your account has been successfully created.</br></br>
			Here are your login details:</br>
			<strong>Email:</strong> ${newUser.email}</br>
			<strong>Password:</strong> ${password}</br></br>
			You can log in using the following link: <a href="${loginUrl}">${loginUrl}</a></br></br>
			For security reasons, we recommend changing your password after logging in.</br></br>
			If you have any questions or need assistance, feel free to contact us at ${SUPPORT_EMAIL}.`,
		};
		notification({ newUser: body.email }, 'mail', data);

		return this.publicProfile(newUser);
	}

	async updateUser() {
		const { body, user, file } = this.req;
		const {
			approved,
			business_name: name,
			business_address: address,
			business_phone: phone,
			business_website: website,
			business_categories: categories,
			...userInfo
		} = body;
		const id = this.req?.params?.id
			? parseInt(this.req.params.id, 10)
			: user.id;

		if (user.id === id && userInfo.status === 'BLOCKED') {
			throw new AppError(
				'You are not allowed to block yourself',
				HttpStatus.NOT_FOUND,
			);
		}

		if (userInfo.password) {
			userInfo.password = await bcrypt.hash(userInfo.password, 12);
		}

		const updateRecord = await prisma.user.update({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			data: {
				...(file?.filename ? { image: file.filename } : {}),
				...(approved !== undefined && user.role_id === 1 ? { approved } : {}),
				...userInfo,
			},
		});

		if (
			updateRecord.role_id === 3 &&
			updateRecord.business_id &&
			(name ||
				address ||
				phone ||
				website ||
				file?.filename ||
				userInfo.lat_long ||
				userInfo.postal_code ||
				userInfo.city ||
				userInfo.country)
		) {
			await prisma.business.update({
				where: {
					id: updateRecord.business_id,
				},
				data: {
					...(name ? { name } : {}),
					...(address ? { address } : {}),
					...(phone ? { phone } : {}),
					...(website ? { website } : {}),
					...(file?.filename ? { image: file.filename } : {}),
					...(userInfo?.lat_long ? { lat_long: userInfo.lat_long } : {}),
					...(userInfo?.postal_code
						? { postal_code: userInfo.postal_code }
						: {}),
					...(userInfo?.city ? { city: userInfo.city } : {}),
					...(userInfo?.country ? { country: userInfo.country } : {}),
				},
			});
			if (categories) {
				await prisma.business_category.deleteMany({
					where: {
						business_id: updateRecord.business_id,
					},
				});

				const businessCategories = categories.map(categId => ({
					business_id: updateRecord.business_id,
					category_id: categId,
				}));

				await prisma.business_category.createMany({
					data: businessCategories,
				});
			}
		}

		return this.publicProfile(updateRecord);
	}

	async updateManyUser() {
		const { body, user } = this.req;
		const {
			ids,
			approved,
			...userInfo
		} = body;

		// if (user.id === id && userInfo.status === 'BLOCKED') {
		// 	throw new AppError(
		// 		'You are not allowed to block yourself',
		// 		HttpStatus.NOT_FOUND,
		// 	);
		// }

		if (userInfo.password) {
			userInfo.password = await bcrypt.hash(userInfo.password, 12);
		}

		const updateRecord = await prisma.user.updateMany({
			where: {
				deleted: false,
				id: {
					in: ids,
				},
			},
			data: {
				...(approved !== undefined ? { approved } : {}),
				...userInfo,
			},
		});

		return true;
	}

	async deleteUser() {
		const { user } = this.req;
		const { id } = this.req.params;

		if (user.id === id) {
			throw new AppError(
				'You are not allowed to delete yourself',
				HttpStatus.NOT_FOUND,
			);
		}

		const delUser = await prisma.user.update({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			data: {
				deleted: true,
			},
		});

		if (delUser.role_id === 3 && delUser.business_id > 0) {
			await prisma.business.update({
				where: {
					deleted: false,
					id: parseInt(delUser.business_id, 10),
				},
				data: {
					deleted: true,
				},
			});
		}

		return null;
	}

	async deleteManyUser() {
		const { user } = this.req;
		const { ids } = this.req.body;

		if (ids.includes(user.id)) {
			throw new AppError(
				'You are not allowed to delete yourself',
				HttpStatus.NOT_FOUND,
			);
		}

		await prisma.user.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data: {
				deleted: true,
			},
		});

		return null;
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

	/* eslint-disable-next-line class-methods-use-this */
	async adminStats() {
		const paymentSummary = await prisma.payment.aggregate({
			where: {
				status: PAYMENT_STATUS.COMPLETED,
			},
			_count: true,
			_sum: {
				amount: true,
			},
		});

		const reportedReviews = await prisma.review_report.aggregate({
			_count: true,
		});

		const paymentsByMonth = await prisma.$queryRaw`
			SELECT 
				DATE_FORMAT(created_at, '%Y-%m') AS month, 
				SUM(amount) AS totalAmount,
				count(*) AS totalCount
			FROM payment
			where status = ${PAYMENT_STATUS.COMPLETED}
				AND created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
			GROUP BY month
			ORDER BY month ASC;
		`;

		const formattedPayments = paymentsByMonth.map(payment => ({
			month: payment.month,
			totalCount: Number(payment.totalCount),
			totalAmount: Number(payment.totalAmount),
		}));

		return {
			orderCount: paymentSummary._count,
			orderTotal: paymentSummary._sum.amount,
			reportedReviews: reportedReviews._count,
			paymentsByMonth: formattedPayments,
		};
	}
}
