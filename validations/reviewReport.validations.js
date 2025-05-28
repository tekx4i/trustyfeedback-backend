import { PrismaClient } from '@prisma/client';
import yup from 'yup';

import {
	INTEGER_ERROR,
	REQUIRED_FIELDS,
	INVALID_REVIEW_ID,
	INVALID_REVIEW_REPORT_ID,
	GET_REVIEW_REPORT_QUERY_SCHEMA_CONFIG,
} from '../constants';
import { createQueryParamsSchema } from '../utils';

const prisma = new PrismaClient();

export const getReviewReportSchema = yup.object({
	query: createQueryParamsSchema(GET_REVIEW_REPORT_QUERY_SCHEMA_CONFIG),
});

export const addReviewReportSchema = yup.object({
	body: yup.object({
		review_id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_REVIEW_ID,
				async test(value) {
					const record = await prisma.review.findUnique({
						where: {
							deleted: false,
							id: parseInt(value, 10),
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
		reason: yup.string().required(REQUIRED_FIELDS),
	}),
	file: yup.mixed(),
});

export const updateReviewReportSchema = yup.object({
	body: yup.object({
		status: yup.string().required(REQUIRED_FIELDS),
	}),
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_REVIEW_REPORT_ID,
				async test(value) {
					const record = await prisma.review_report.findUnique({
						where: {
							id: parseInt(value, 10),
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
	}),
	file: yup.mixed(),
});

export const ReviewReportIdSchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_REVIEW_REPORT_ID,
				async test(value) {
					const record = await prisma.review_report.findUnique({
						where: {
							id: parseInt(value, 10),
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
	}),
});

export const deleteReviewReportsSchema = yup.object({
	body: yup.object({
		ids: yup
			.array()
			.of(
				yup
					.number()
					.integer()
					.required(REQUIRED_FIELDS)
					.test(
						'is-valid-reviewReport',
						INVALID_REVIEW_REPORT_ID,
						async value => {
							const record = await prisma.review_report.findUnique({
								where: {
									id: parseInt(value, 10),
								},
							});
							return !record || !record.id ? Boolean(0) : Boolean(1);
						},
					),
			)
			.required(REQUIRED_FIELDS),
	}),
});
