import { PrismaClient } from '@prisma/client';
import yup from 'yup';

import {
	INTEGER_ERROR,
	REQUIRED_FIELDS,
	INVALID_ROLE_ID,
	INVALID_PACKAGE_ID,
	GET_PACKAGE_QUERY_SCHEMA_CONFIG,
} from '../constants';
import { createQueryParamsSchema } from '../utils';

const prisma = new PrismaClient();

export const getPackageSchema = yup.object({
	query: createQueryParamsSchema(GET_PACKAGE_QUERY_SCHEMA_CONFIG),
});

export const addPackageSchema = yup.object({
	body: yup.object({
		name: yup.string().required(REQUIRED_FIELDS),
		description: yup.string().required(REQUIRED_FIELDS),
		price: yup.number().default(0),
		days: yup.number().positive().notRequired(),
		role_id: yup
			.number()
			.positive()
			.required(REQUIRED_FIELDS)
			.test({
				name: 'invalid-role',
				message: INVALID_ROLE_ID,
				async test(value) {
					const record = await prisma.roles.findUnique({
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

export const updatePackageSchema = yup.object({
	body: yup.object({
		name: yup.string().notRequired(),
		description: yup.string().notRequired(),
		price: yup.number().notRequired(),
		days: yup.number().positive().notRequired(),
		role_id: yup
			.number()
			.positive()
			.notRequired()
			.test({
				name: 'invalid-role',
				message: INVALID_ROLE_ID,
				async test(value) {
					if (!value) return true;
					const record = await prisma.roles.findUnique({
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
				message: INVALID_PACKAGE_ID,
				async test(value) {
					const record = await prisma.packages.findUnique({
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

export const PackageIdSchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_PACKAGE_ID,
				async test(value) {
					const record = await prisma.packages.findUnique({
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

export const deletePackagesSchema = yup.object({
	body: yup.object({
		ids: yup.array().required(REQUIRED_FIELDS),
	}),
});
