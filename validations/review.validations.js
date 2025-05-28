import { PrismaClient } from '@prisma/client';
import yup from 'yup';

import {
	INTEGER_ERROR,
	REQUIRED_FIELDS,
	INVALID_REVIEW_ID,
	INVALID_BUSINESS_ID,
	INVALID_CATEGORY_ID,
	GET_REVIEW_QUERY_SCHEMA_CONFIG,
} from '../constants';
import { createQueryParamsSchema } from '../utils';

const prisma = new PrismaClient();

export const getReviewSchema = yup.object({
	query: createQueryParamsSchema(GET_REVIEW_QUERY_SCHEMA_CONFIG),
});

export const addReviewSchema = yup.object({
	body: yup.object({
		business_id: yup
			.number()
			.positive(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_BUSINESS_ID,
				async test(value) {
					const record = await prisma.business.findUnique({
						where: {
							deleted: false,
							id: parseInt(value, 10),
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
		category_id: yup
			.number()
			.positive(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_CATEGORY_ID,
				async test(value) {
					if (!value) return true;
					const { business_id: businessId } = this.options.body;
					const record = await prisma.business_category.findFirst({
						where: {
							business_id: parseInt(businessId, 10),
							category_id: parseInt(value, 10),
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
		rating: yup
			.number()
			.positive(INTEGER_ERROR)
			.max(5, 'Rating cannot exceed 5')
			.required(REQUIRED_FIELDS),
		title: yup.string().notRequired(),
		comment: yup.string().notRequired(),
		latitude: yup.number().notRequired(),
		longitude: yup.number().notRequired(),
		info: yup
			.array()
			.of(
				yup.object({
					key: yup.string().required(REQUIRED_FIELDS),
					value: yup.string().required(REQUIRED_FIELDS),
				}),
			)
			.required(REQUIRED_FIELDS),
	}),
	file: yup.mixed(),
});

export const updateReviewSchema = yup.object({
	body: yup.object({
		business_id: yup
			.number()
			.positive(INTEGER_ERROR)
			.notRequired()
			.test({
				name: 'valid-form',
				message: INVALID_BUSINESS_ID,
				async test(value) {
					if (value === undefined || value === null) {
						return true;
					}
					const record = await prisma.business.findUnique({
						where: {
							deleted: false,
							id: parseInt(value, 10),
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
		rating: yup
			.number()
			.positive(INTEGER_ERROR)
			.max(5, 'Rating cannot exceed 5')
			.notRequired(),
		title: yup.string().notRequired(),
		comment: yup.string().notRequired(),
		approved: yup.boolean().notRequired(),
		status: yup.string().notRequired(),
		latitude: yup.number().notRequired(),
		longitude: yup.number().notRequired(),
	}),
	params: yup.object({
		id: yup
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
	}),
	file: yup.mixed(),
});

export const updateManyReviewSchema = yup.object({
	body: yup.object({
		approved: yup.boolean().notRequired(),
		status: yup.string().notRequired(),
		type: yup.string().notRequired(),
		verified_status: yup.string().notRequired(),
		weight: yup.number().notRequired(),
		ids: yup
			.array()
			.required(REQUIRED_FIELDS)
			.of(
				yup
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
			),
	}),
});

export const ReviewIdSchema = yup.object({
	params: yup.object({
		id: yup
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
	}),
});

export const verifyReviewSchema = yup.object({
	body: yup.object({
		otp: yup.string().min(4).max(4).required(REQUIRED_FIELDS),
	}),
});

export const deleteReviewsSchema = yup.object({
	body: yup.object({
		ids: yup
			.array()
			.required(REQUIRED_FIELDS)
			.of(
				yup
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
			),
	}),
});
