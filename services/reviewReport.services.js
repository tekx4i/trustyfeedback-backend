import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { REVIEW_REPORT_NOT_FOUND } from '../constants';
import { AppError } from '../errors';

const prisma = new PrismaClient();

export class ReviewReportService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllReviewReports() {
		const { query } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;

		const options = {
			where: {},
		};

		if (search) {
			options.where.AND = Object.keys(search).map(key => {
				if (key === 'review_id' || key === 'reported_by') {
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

		const totalCount = await prisma.review_report.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;
		options.include = {
			review: {
				include: {
					business: true,
					user: {
						select: {
							name: true,
							image: true,
						},
					},
				},
			},
			user: {
				select: {
					name: true,
					image: true,
					business: true,
				},
			},
		};

		const allRecords = await prisma.review_report.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(
				REVIEW_REPORT_NOT_FOUND,
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

	async getReviewReport() {
		const { id } = this.req.params;
		const record = await prisma.review_report.findUnique({
			where: {
				id: parseInt(id, 10),
			},
			include: {
				review: true,
				user: {
					select: {
						name: true,
						image: true,
					},
				},
			},
		});
		if (!record || !record.id)
			throw new AppError(REVIEW_REPORT_NOT_FOUND, HttpStatus.NOT_FOUND);
		return record;
	}

	async createReviewReport() {
		const { body, user } = this.req;

		const record = await prisma.review_report.create({
			data: {
				reported_by: user.id,
				...body,
			},
		});

		return { record };
	}

	async updateReviewReport() {
		const { id } = this.req.params;
		const { status } = this.req.body;

		const updateRecord = await prisma.review_report.update({
			where: {
				id: parseInt(id, 10),
			},
			data: {
				resolved_at: new Date(),
				status,
			},
		});

		return updateRecord;
	}
}
