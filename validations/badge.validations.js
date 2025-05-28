import { PrismaClient } from '@prisma/client';
import yup from 'yup';

import {
	REQUIRED_FIELDS,
	INVALID_BADGE_ID,
	GET_BADGE_QUERY_SCHEMA_CONFIG,
	INTEGER_ERROR,
} from '../constants';
import { createQueryParamsSchema } from '../utils';

const prisma = new PrismaClient();

export const getBadgeSchema = yup.object({
	query: createQueryParamsSchema(GET_BADGE_QUERY_SCHEMA_CONFIG),
});

export const addBadgeSchema = yup.object({
	body: yup.object({
		name: yup.string().required(REQUIRED_FIELDS),
		description: yup.string().required(REQUIRED_FIELDS),
		success_percentage: yup.number().notRequired(),
		success_count: yup.number().notRequired(),
		auto_approve: yup.boolean().notRequired(),
		min_points: yup.number().required(REQUIRED_FIELDS),
		max_points: yup.number().required(REQUIRED_FIELDS),
	}),
	file: yup
		.mixed()
		.required(REQUIRED_FIELDS)
		.test(
			'is-file-uploaded',
			'File is required',
			value => value?.filename?.length > 0,
		),
});

export const updateBadgeSchema = yup.object({
	body: yup.object({
		name: yup.string().notRequired(),
		description: yup.string().notRequired(),
		success_percentage: yup.number().notRequired(),
		success_count: yup.number().notRequired(),
		auto_approve: yup.boolean().notRequired(),
		min_points: yup.number().notRequired(),
		max_points: yup.number().notRequired(),
	}),
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_BADGE_ID,
				async test(value) {
					const record = await prisma.badge.findUnique({
						where: {
							is_deleted: false,
							id: parseInt(value, 10),
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
	}),
	file: yup.mixed(),
});

export const BadgeIdSchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_BADGE_ID,
				async test(value) {
					const record = await prisma.badge.findUnique({
						where: {
							is_deleted: false,
							id: parseInt(value, 10),
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
	}),
});

export const deleteBadgesSchema = yup.object({
	body: yup.object({
		ids: yup.array().required(REQUIRED_FIELDS),
	}),
});
