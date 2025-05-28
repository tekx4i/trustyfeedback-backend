import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { BLOG_CATEGORY_NOT_FOUND } from '../constants';
import { AppError } from '../errors';

const prisma = new PrismaClient();

export class BlogCategoryService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllBlogCategorys() {
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

		const totalCount = await prisma.blog_category.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;
		options.include = {
			parent: true,
			children: true,
			// blog: true,
		};

		const allRecords = await prisma.blog_category.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(
				BLOG_CATEGORY_NOT_FOUND,
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

	async getBlogCategory() {
		const { id } = this.req.params;
		const record = await prisma.blog_category.findUnique({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			include: {
				parent: true,
				children: true,
				// blog: true,
			},
		});
		if (!record || !record.id)
			throw new AppError(BLOG_CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND);
		return record;
	}

	async createBlogCategory() {
		const { body, file } = this.req;

		const record = await prisma.blog_category.create({
			data: {
				...(file?.filename ? { image: file.filename } : {}),
				...body,
			},
		});

		return { record };
	}

	async updateBlogCategory() {
		const { id } = this.req.params;
		const { body, file } = this.req;

		const updateRecord = await prisma.blog_category.update({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			data: {
				...(file?.filename ? { image: file.filename } : {}),
				...body,
			},
		});

		return updateRecord;
	}

	async deleteBlogCategory() {
		const { id } = this.req.params;

		await prisma.blog_category.update({
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

	async deleteManyBlogCategory() {
		const { ids } = this.req.body;

		await prisma.blog_category.updateMany({
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
