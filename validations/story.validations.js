import { PrismaClient } from '@prisma/client';
import yup from 'yup';

import {
	REQUIRED_FIELDS,
	INVALID_STORY_ID,
	GET_STORY_QUERY_SCHEMA_CONFIG,
	INTEGER_ERROR,
} from '../constants';
import { createQueryParamsSchema } from '../utils';

const prisma = new PrismaClient();

export const getStorySchema = yup.object({
	query: createQueryParamsSchema(GET_STORY_QUERY_SCHEMA_CONFIG),
});

export const addStorySchema = yup.object({
	body: yup.object({
		title: yup.string().required(REQUIRED_FIELDS),
		content: yup.string().required(REQUIRED_FIELDS),
	}),
	file: yup.mixed(),
});

export const updateStorySchema = yup.object({
	body: yup.object({
		title: yup.string().notRequired(),
		content: yup.string().notRequired(),
	}),
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_STORY_ID,
				async test(value) {
					const record = await prisma.story.findUnique({
						where: {
							isActive: true,
							id: parseInt(value, 10),
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
	}),
	file: yup.mixed(),
});

export const StoryIdSchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_STORY_ID,
				async test(value) {
					const record = await prisma.story.findUnique({
						where: {
							isActive: true,
							id: parseInt(value, 10),
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
	}),
});

export const deleteStoriesSchema = yup.object({
	body: yup.object({
		ids: yup.array().required(REQUIRED_FIELDS),
	}),
});
