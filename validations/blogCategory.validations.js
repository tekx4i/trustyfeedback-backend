import { PrismaClient } from '@prisma/client';
import yup from 'yup';

import {
	INTEGER_ERROR,
	REQUIRED_FIELDS,
	INVALID_BLOG_CATEGORY_ID,
	GET_BLOG_CATEGORY_QUERY_SCHEMA_CONFIG,
} from '../constants';
import { createQueryParamsSchema } from '../utils';

const prisma = new PrismaClient();

export const getBlogCategorySchema = yup.object({
	query: createQueryParamsSchema(GET_BLOG_CATEGORY_QUERY_SCHEMA_CONFIG),
});

export const addBlogCategorySchema = yup.object({
	body: yup.object({
		name: yup.string().required(REQUIRED_FIELDS),
		description: yup.string().required(REQUIRED_FIELDS),
		parent_id: yup
			.number()
			.notRequired()
			.test('is-valid-parent-id', INVALID_BLOG_CATEGORY_ID, async value => {
				if (!value) return true;
				const record = await prisma.blog_category.findUnique({
					where: { id: value },
				});
				return !record || !record.id ? Boolean(0) : Boolean(1);
			}),
	}),
	file: yup.mixed(),
});

export const updateBlogCategorySchema = yup.object({
	body: yup.object({
		name: yup.string().notRequired(),
		description: yup.string().notRequired(),
		parent_id: yup
			.number()
			.notRequired()
			.test('is-valid-parent-id', INVALID_BLOG_CATEGORY_ID, async value => {
				if (!value) return true;
				const record = await prisma.blog_category.findUnique({
					where: { id: value },
				});
				return !record || !record.id ? Boolean(0) : Boolean(1);
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
				message: INVALID_BLOG_CATEGORY_ID,
				async test(value) {
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

export const BlogCategoryIdSchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_BLOG_CATEGORY_ID,
				async test(value) {
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
});

export const deleteBlogCategorysSchema = yup.object({
	body: yup.object({
		ids: yup
			.array()
			.of(
				yup
					.number()
					.integer()
					.required(REQUIRED_FIELDS)
					.test(
						'is-valid-blogCategory',
						INVALID_BLOG_CATEGORY_ID,
						async value => {
							if (!value) return false;
							const record = await prisma.blog_category.findUnique({
								where: {
									deleted: false,
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
