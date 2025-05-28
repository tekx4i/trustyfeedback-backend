import { PrismaClient } from '@prisma/client';
import yup from 'yup';

import {
	REQUIRED_FIELDS,
	INVALID_PAGE_ID,
	GET_PAGE_QUERY_SCHEMA_CONFIG,
	INTEGER_ERROR,
} from '../constants';
import { createQueryParamsSchema } from '../utils';

const prisma = new PrismaClient();

export const getPageSchema = yup.object({
	query: createQueryParamsSchema(GET_PAGE_QUERY_SCHEMA_CONFIG),
});

export const addPageSchema = yup.object({
	body: yup.object({
		title: yup.string().required(REQUIRED_FIELDS),
		slug: yup.string().notRequired(),
		meta_title: yup.string().notRequired(),
		meta_description: yup.string().notRequired(),
		type: yup
			.string()
			.default('static')
			.oneOf(['static', 'pre-defined'], 'Invalid Page Type'),
		content: yup.string().when('type', {
			is: type => type !== 'pre-defined',
			then: schema => schema.required(REQUIRED_FIELDS),
			otherwise: schema => schema.optional(),
		}),
		url: yup.string().when('type', {
			is: 'pre-defined',
			then: schema => schema.required(REQUIRED_FIELDS),
			otherwise: schema => schema.optional(),
		}),
	}),
	file: yup.mixed(),
});

export const updatePageSchema = yup.object({
	body: yup.object({
		title: yup.string().notRequired(),
		slug: yup.string().notRequired(),
		content: yup.string().notRequired(),
		meta_title: yup.string().notRequired(),
		meta_description: yup.string().notRequired(),
	}),
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_PAGE_ID,
				async test(value) {
					const record = await prisma.page.findUnique({
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

export const PageIdSchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_PAGE_ID,
				async test(value) {
					const record = await prisma.page.findUnique({
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

export const GetPageByUrlSchema = yup.object({
	query: yup.object({
		url: yup.string().required(REQUIRED_FIELDS),
	}),
});

export const deletePagesSchema = yup.object({
	body: yup.object({
		ids: yup.array().required(REQUIRED_FIELDS),
	}),
});
