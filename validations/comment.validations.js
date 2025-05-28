import { PrismaClient } from '@prisma/client';
import yup from 'yup';

import {
	INTEGER_ERROR,
	REQUIRED_FIELDS,
	INVALID_BLOG_ID,
	INVALID_STORY_ID,
	INVALID_REVIEW_ID,
	INVALID_COMMENT_ID,
	INVALID_BUSINESS_ID,
	GET_COMMENT_QUERY_SCHEMA_CONFIG,
} from '../constants';
import { createQueryParamsSchema } from '../utils';

const prisma = new PrismaClient();

export const getCommentSchema = yup.object({
	query: createQueryParamsSchema(GET_COMMENT_QUERY_SCHEMA_CONFIG),
});

export const addCommentSchema = yup.object({
	body: yup
		.object({
			content: yup.string().required(REQUIRED_FIELDS),
			parent_id: yup
				.number()
				.notRequired()
				.test({
					name: 'valid-form',
					message: INVALID_COMMENT_ID,
					async test(value) {
						if (!value) return true;
						const record = await prisma.comment.findUnique({
							where: {
								id: parseInt(value, 10),
							},
						});
						return !record || !record.id ? Boolean(0) : Boolean(1);
					},
				}),
			business_id: yup
				.number()
				.notRequired()
				.test({
					name: 'valid-form',
					message: INVALID_BUSINESS_ID,
					async test(value) {
						if (!value) return true;
						const record = await prisma.business.findUnique({
							where: {
								deleted: false,
								id: parseInt(value, 10),
							},
						});
						return !record || !record.id ? Boolean(0) : Boolean(1);
					},
				}),
			blog_id: yup
				.number()
				.notRequired()
				.test({
					name: 'valid-form',
					message: INVALID_BLOG_ID,
					async test(value) {
						if (!value) return true;
						const record = await prisma.blog.findUnique({
							where: {
								deleted: false,
								id: parseInt(value, 10),
							},
						});
						return !record || !record.id ? Boolean(0) : Boolean(1);
					},
				}),
			review_id: yup
				.number()
				.notRequired()
				.test({
					name: 'valid-form',
					message: INVALID_REVIEW_ID,
					async test(value) {
						if (!value) return true;
						const record = await prisma.review.findUnique({
							where: {
								deleted: false,
								id: parseInt(value, 10),
							},
						});
						return !record || !record.id ? Boolean(0) : Boolean(1);
					},
				}),
			story_id: yup
				.number()
				.notRequired()
				.test({
					name: 'valid-form',
					message: INVALID_STORY_ID,
					async test(value) {
						if (!value) return true;
						const record = await prisma.story.findUnique({
							where: {
								isActive: true,
								id: parseInt(value, 10),
							},
						});
						return !record || !record.id ? Boolean(0) : Boolean(1);
					},
				}),
		})
		.test({
			name: 'at-least-one-id',
			message:
				'At least one of parent_id, business_id, blog_id, review_id, or story_id is required.',
			test(value) {
				const {
					parent_id: parentId,
					business_id: businessId,
					blog_id: blogId,
					review_id: reviewId,
					story_id: storyId,
				} = value || {};
				return parentId || businessId || blogId || reviewId || storyId;
			},
		}),
	file: yup.mixed(),
});

export const updateCommentSchema = yup.object({
	body: yup.object({
		content: yup.string().required(REQUIRED_FIELDS),
	}),
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_COMMENT_ID,
				async test(value) {
					const record = await prisma.comment.findUnique({
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

export const CommentIdSchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_COMMENT_ID,
				async test(value) {
					const record = await prisma.comment.findUnique({
						where: {
							id: parseInt(value, 10),
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
	}),
});

export const deleteCommentsSchema = yup.object({
	body: yup.object({
		ids: yup.array().required(REQUIRED_FIELDS),
	}),
});
