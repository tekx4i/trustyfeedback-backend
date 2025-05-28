import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { NOTIFICATION_NOT_FOUND } from '../constants';
import { AppError } from '../errors';

const prisma = new PrismaClient();

export class NotificationService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllNotifications() {
		const { query, user } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;

		const options = {
			where: {
				user_id: user.id,
				// ...(user.role_id === 3 ? {} : { user_id: user.id }),
			},
		};

		if (search) {
			options.where.AND = Object.keys(search).map(key => {
				if (key === 'user_id' || key === 'type') {
					return { [key]: search[key] };
				}
				if (key === 'is_read') {
					return { [key]: search[key] === 'true' };
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

		const totalCount = await prisma.notification.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;

		const allRecords = await prisma.notification.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(
				NOTIFICATION_NOT_FOUND,
				HttpStatus.NOT_FOUND,
				allRecords,
			);

		return {
			records: allRecords,
			totalRecords: totalCount,
			totalPages,
			query,
		};
	}

	async getNotification() {
		const { id } = this.req.params;
		const record = await prisma.notification.findUnique({
			where: {
				id: parseInt(id, 10),
			},
		});
		if (!record || !record.id)
			throw new AppError(NOTIFICATION_NOT_FOUND, HttpStatus.NOT_FOUND);
		return record;
	}

	async updateNotification() {
		const { id } = this.req.params;
		const { body } = this.req;

		const updateRecord = await prisma.notification.update({
			where: {
				id: parseInt(id, 10),
			},
			data: body,
		});

		return updateRecord;
	}

	async readAllNotification() {
		const { user } = this.req;

		await prisma.notification.updateMany({
			where: {
				user_id: user.id,
			},
			data: {
				is_read: true,
			},
		});

		return {};
	}

	async deleteNotification() {
		const { id } = this.req.params;

		await prisma.notification.delete({
			where: {
				id: parseInt(id, 10),
			},
		});

		return null;
	}

	async deleteManyNotification() {
		const { ids } = this.req.body;

		await prisma.notification.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});

		return null;
	}
}
