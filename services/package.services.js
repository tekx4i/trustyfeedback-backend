import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { PACKAGE_NOT_FOUND } from '../constants';
import { AppError } from '../errors';

const prisma = new PrismaClient();

export class PackageService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllPackages() {
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
				if (key === 'price' || key === 'days' || key === 'role_id') {
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

		const totalCount = await prisma.packages.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;
		options.include = {
			role: {
				select: {
					name: true,
					description: true,
				},
			},
		};

		const allRecords = await prisma.packages.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(PACKAGE_NOT_FOUND, HttpStatus.NOT_FOUND, allRecords);

		return {
			records: allRecords,
			totalRecords: totalCount,
			totalPages,
			query,
		};
	}

	async getPackage() {
		const { id } = this.req.params;
		const record = await prisma.packages.findUnique({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			include: {
				role: {
					select: {
						name: true,
						description: true,
					},
				},
			},
		});
		if (!record || !record.id)
			throw new AppError(PACKAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
		return record;
	}

	async createPackage() {
		const { body } = this.req;

		const record = await prisma.packages.create({
			data: body,
		});

		return { record };
	}

	async updatePackage() {
		const { id } = this.req.params;
		const { body } = this.req;

		const updateRecord = await prisma.packages.update({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			data: body,
		});

		return updateRecord;
	}

	async deletePackage() {
		const { id } = this.req.params;

		await prisma.packages.update({
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

	async deleteManyPackage() {
		const { ids } = this.req.body;

		await prisma.packages.updateMany({
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
