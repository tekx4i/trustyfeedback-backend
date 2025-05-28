import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { ADMIN_OPTION_NOT_FOUND } from '../constants';
import { AppError } from '../errors';

const prisma = new PrismaClient();

export class AdminOptionService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllAdminOptions() {
		const { query } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;

		const options = {
			where: {},
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

		const totalCount = await prisma.admin_options.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;

		const allRecords = await prisma.admin_options.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(
				ADMIN_OPTION_NOT_FOUND,
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

	async getAdminOption() {
		const { id } = this.req.params;
		const record = await prisma.admin_options.findUnique({
			where: {
				id: parseInt(id, 10),
			},
		});
		if (!record || !record.id)
			throw new AppError(ADMIN_OPTION_NOT_FOUND, HttpStatus.NOT_FOUND);
		return record;
	}

	async createAdminOption() {
		const { body } = this.req;

		const record = await prisma.admin_options.create({
			data: body,
		});

		return { record };
	}

	async updateAdminOption() {
		const { id } = this.req.params;
		const { body } = this.req;

		const updateRecord = await prisma.admin_options.update({
			where: {
				id: parseInt(id, 10),
			},
			data: body,
		});

		return updateRecord;
	}

	async deleteAdminOption() {
		const { id } = this.req.params;

		await prisma.admin_options.delete({
			where: {
				id: parseInt(id, 10),
			},
		});

		return null;
	}

	async deleteManyAdminOption() {
		const { ids } = this.req.body;

		await prisma.admin_options.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});

		return null;
	}
}
