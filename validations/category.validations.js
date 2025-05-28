import { PrismaClient } from '@prisma/client';
import yup from 'yup';

import {
	INTEGER_ERROR,
	REQUIRED_FIELDS,
	INVALID_CATEGORY_ID,
	GET_CATEGORY_QUERY_SCHEMA_CONFIG,
} from '../constants';
import { createQueryParamsSchema } from '../utils';

const prisma = new PrismaClient();

export const getCategorySchema = yup.object({
	query: createQueryParamsSchema(GET_CATEGORY_QUERY_SCHEMA_CONFIG),
});

export const addCategorySchema = yup.object({
	body: yup.object({
		name: yup.string().required(REQUIRED_FIELDS),
		description: yup.string().notRequired(),
		weight: yup.number().positive().default(1),
		nv_weight: yup.number().positive().default(1),
		parent_id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.notRequired()
			.test({
				name: 'valid-form',
				message: INVALID_CATEGORY_ID,
				async test(value) {
					if (value === undefined || value === null) {
						return true;
					}
					const record = await prisma.category.findUnique({
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

export const updateCategorySchema = yup.object({
	body: yup.object({
		name: yup.string().notRequired(),
		description: yup.string().notRequired(),
		weight: yup.number().positive().integer(INTEGER_ERROR).notRequired(),
		nv_weight: yup.number().positive().integer(INTEGER_ERROR).notRequired(),
		parent_id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.notRequired()
			.test({
				name: 'valid-form',
				message: INVALID_CATEGORY_ID,
				async test(value) {
					if (value === undefined || value === null) {
						return true;
					}
					const record = await prisma.category.findUnique({
						where: {
							deleted: false,
							id: parseInt(value, 10),
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
	}),
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_CATEGORY_ID,
				async test(value) {
					const record = await prisma.category.findUnique({
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

export const CategoryIdSchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_CATEGORY_ID,
				async test(value) {
					const record = await prisma.category.findUnique({
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

export const deleteCategorySchema = yup.object({
	body: yup.object({
		ids: yup.array().required(REQUIRED_FIELDS),
	}),
});
