import { PrismaClient } from '@prisma/client';
import yup from 'yup';

import {
	REQUIRED_FIELDS,
	INVALID_BUSINESS_ID,
	GET_BUSINESS_QUERY_SCHEMA_CONFIG,
	INTEGER_ERROR,
} from '../constants';
import { createQueryParamsSchema } from '../utils';

const prisma = new PrismaClient();

export const getBusinessSchema = yup.object({
	query: createQueryParamsSchema(GET_BUSINESS_QUERY_SCHEMA_CONFIG),
});

export const addBusinessSchema = yup.object({
	body: yup.object({
		name: yup.string().required(REQUIRED_FIELDS),
		address: yup.string().required(REQUIRED_FIELDS),
		phone: yup.string().required(REQUIRED_FIELDS),
		website: yup.string().required(REQUIRED_FIELDS),
		description: yup.string().notRequired(),
	}),
});

export const updateBusinessSchema = yup.object({
	body: yup.object({
		name: yup.string().notRequired(),
		address: yup.string().notRequired(),
		phone: yup.string().notRequired(),
		website: yup.string().notRequired(),
		description: yup.string().notRequired(),
	}),
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
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
	}),
	file: yup.mixed(),
});

export const BusinessIdSchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
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
	}),
});

export const deleteBusinesssSchema = yup.object({
	body: yup.object({
		ids: yup.array().required(REQUIRED_FIELDS),
	}),
});
