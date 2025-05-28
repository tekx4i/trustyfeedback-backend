import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';
import slugify from 'slugify';

import { PAGE_NOT_FOUND } from '../constants';
import { AppError } from '../errors';

const prisma = new PrismaClient();

export class PageService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllPages() {
		const { query } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;

		const options = {
			where: {
				isActive: true,
			},
		};

		if (search) {
			options.where.AND = Object.keys(search).map(key => {
				if (key === 'author_id' || key === 'slug') {
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

		const totalCount = await prisma.page.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;

		const allRecords = await prisma.page.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(PAGE_NOT_FOUND, HttpStatus.NOT_FOUND, allRecords);

		return {
			records: allRecords,
			totalRecords: totalCount,
			totalPages,
			query,
		};
	}

	async getPage() {
		const { id } = this.req.params;
		const record = await prisma.page.findUnique({
			where: {
				isActive: true,
				id: parseInt(id, 10),
			},
		});
		if (!record || !record.id)
			throw new AppError(PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
		return record;
	}

	async getPageByUrl() {
		const { url } = this.req.query;
		const record = await prisma.page.findFirst({
			where: {
				url,
			},
		});
		if (!record || !record.id)
			throw new AppError(PAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
		return record;
	}

	async createPage() {
		const { user, body, file } = this.req;

		body.slug = body.slug ?? slugify(body.title, { lower: true, strict: true });

		const record = await prisma.page.create({
			data: {
				author_id: user.id,
				...(file?.filename ? { imageUrl: file.filename } : {}),
				...body,
			},
		});

		return { record };
	}

	async updatePage() {
		const { id } = this.req.params;
		const { body, file } = this.req;

		const updateRecord = await prisma.page.update({
			where: {
				isActive: true,
				id: parseInt(id, 10),
			},
			data: {
				...(file?.filename ? { imageUrl: file.filename } : {}),
				...body,
			},
		});

		return updateRecord;
	}

	async deletePage() {
		const { id } = this.req.params;

		await prisma.page.update({
			where: {
				isActive: true,
				id: parseInt(id, 10),
			},
			data: {
				isActive: false,
			},
		});

		return null;
	}

	async deleteManyPage() {
		const { ids } = this.req.body;

		await prisma.page.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data: {
				isActive: false,
			},
		});

		return null;
	}
}
