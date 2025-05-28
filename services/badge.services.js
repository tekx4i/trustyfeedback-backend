import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { BADGE_NOT_FOUND } from '../constants';
import { AppError } from '../errors';

const prisma = new PrismaClient();

export class BadgeService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllBadges() {
		const { query } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;

		const options = {
			where: {
				is_deleted: false,
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

		const totalCount = await prisma.badge.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;

		const allRecords = await prisma.badge.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(BADGE_NOT_FOUND, HttpStatus.NOT_FOUND, allRecords);

		return {
			records: allRecords,
			totalRecords: totalCount,
			totalPages,
			query,
		};
	}

	async getBadge() {
		const { id } = this.req.params;
		const record = await prisma.badge.findUnique({
			where: {
				is_deleted: false,
				id: parseInt(id, 10),
			},
		});
		if (!record || !record.id)
			throw new AppError(BADGE_NOT_FOUND, HttpStatus.NOT_FOUND);
		return record;
	}

	async createBadge() {
		const { body, file } = this.req;

		const record = await prisma.badge.create({
			data: {
				...(file?.filename ? { icon: file.filename } : {}),
				...body,
			},
		});

		return { record };
	}

	async updateBadge() {
		const { id } = this.req.params;
		const { body, file } = this.req;

		const updateRecord = await prisma.badge.update({
			where: {
				is_deleted: false,
				id: parseInt(id, 10),
			},
			data: {
				...(file?.filename ? { icon: file.filename } : {}),
				...body,
			},
		});

		return updateRecord;
	}

	async deleteBadge() {
		const { id } = this.req.params;

		await prisma.badge.update({
			where: {
				is_deleted: false,
				id: parseInt(id, 10),
			},
			data: {
				is_deleted: true,
			},
		});

		return null;
	}

	async deleteManyBadge() {
		const { ids } = this.req.body;

		await prisma.badge.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data: {
				is_deleted: true,
			},
		});

		return null;
	}
}
