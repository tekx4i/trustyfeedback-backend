import { PrismaClient } from '@prisma/client';
import yup from 'yup';

import {
	INTEGER_ERROR,
	REQUIRED_FIELDS,
	INVALID_BLOG_ID,
	INVALID_BLOG_CATEGORY_ID,
	GET_BLOG_QUERY_SCHEMA_CONFIG,
} from '../constants';
import { createQueryParamsSchema } from '../utils';

const prisma = new PrismaClient();

export const getBlogSchema = yup.object({
	query: createQueryParamsSchema(GET_BLOG_QUERY_SCHEMA_CONFIG),
});

export const addBlogSchema = yup.object({
	body: yup.object({
		title: yup.string().required(REQUIRED_FIELDS),
		content: yup.string().required(REQUIRED_FIELDS),
		type: yup.string().required(REQUIRED_FIELDS),
		category_id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.notRequired()
			.test({
				name: 'valid-form',
				message: INVALID_BLOG_CATEGORY_ID,
				async test(value) {
					if (!value) return true;
					const record = await prisma.blog_category.findUnique({
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

export const updateBlogSchema = yup.object({
	body: yup.object({
		title: yup.string().notRequired(),
		content: yup.string().notRequired(),
		type: yup.string().notRequired(),
		category_id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.notRequired()
			.test({
				name: 'valid-form',
				message: INVALID_BLOG_CATEGORY_ID,
				async test(value) {
					if (!value) return true;
					const record = await prisma.blog_category.findUnique({
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
				message: INVALID_BLOG_ID,
				async test(value) {
					const record = await prisma.blog.findUnique({
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

export const BlogIdSchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_BLOG_ID,
				async test(value) {
					const record = await prisma.blog.findUnique({
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

export const deleteBlogsSchema = yup.object({
	body: yup.object({
		ids: yup.array().required(REQUIRED_FIELDS),
	}),
});
