import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { CATEGORY_NOT_FOUND } from '../constants';
import { AppError } from '../errors';

const prisma = new PrismaClient();

export class CategoryService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllCategory() {
		const { query } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;

		const options = {
			where: {
				deleted: false,
			},
		};

		if (search) {
			options.where.AND = Object.keys(search).map(key => {
				if (key === 'parent_id') {
					return { [key]: search[key] };
				}
				if (key === 'has_business') {
					return { businesses: { some: {} } };
				}
				if (key === 'is_parent') {
					return search[key] === 'true' ? { parent_id: null } : {};
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

		const totalCount = await prisma.category.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;
		options.include = {
			children: {
				where: {
					deleted: false,
				},
				// include: {
				// 	businesses: true,
				// }
			},
			// businesses: true,
		};

		const allRecords = await prisma.category.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND, allRecords);

		return {
			records: allRecords,
			totalRecords: totalCount,
			totalPages,
			query,
		};
	}

	async getCategory() {
		const { id } = this.req.params;
		const record = await prisma.category.findUnique({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			include: {
				businesses: true,
				children: {
					where: {
						deleted: false,
					},
				},
			},
		});
		if (!record || !record.id)
			throw new AppError(CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
		return record;
	}

	async createCategory() {
		const { body, file } = this.req;

		const category = await prisma.category.create({
			data: {
				...(file?.filename ? { image: file?.filename } : {}),
				...body,
			},
		});

		return { category };
	}

	async updateCategory() {
		const { id } = this.req.params;
		const { body, file } = this.req;

		const updateRecord = await prisma.category.update({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			data: {
				...(file?.filename ? { image: file?.filename } : {}),
				...body,
			},
		});

		return updateRecord;
	}

	async deleteCategory() {
		const { id } = this.req.params;

		await prisma.category.update({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			data: {
				deleted: true,
			},
		});

		return null;
	}

	async deleteManyCategory() {
		const { ids } = this.req.body;

		await prisma.category.updateMany({
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
}
