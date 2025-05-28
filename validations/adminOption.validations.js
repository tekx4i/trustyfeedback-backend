import { PrismaClient } from '@prisma/client';
import yup from 'yup';

import {
	REQUIRED_FIELDS,
	INVALID_ADMIN_OPTION_ID,
	GET_ADMIN_OPTION_QUERY_SCHEMA_CONFIG,
	INTEGER_ERROR,
} from '../constants';
import { createQueryParamsSchema } from '../utils';

const prisma = new PrismaClient();

export const getAdminOptionSchema = yup.object({
	query: createQueryParamsSchema(GET_ADMIN_OPTION_QUERY_SCHEMA_CONFIG),
});

export const addAdminOptionSchema = yup.object({
	body: yup.object({
		key: yup
			.string()
			.required(REQUIRED_FIELDS)
			.test('unique-key', 'Key must be unique', async value => {
				const record = await prisma.admin_options.findFirst({
					where: { key: value },
				});
				return !record || !record.id ? Boolean(1) : Boolean(0);
			}),
		value: yup.string().required(REQUIRED_FIELDS),
	}),
});

export const updateAdminOptionSchema = yup.object({
	body: yup.object({
		key: yup
			.string()
			.notRequired()
			.test({
				name: 'valid-form',
				message: 'Key must be unique',
				async test(value) {
					if (!value) return true;
					const { id } = this.options.params;
					const record = await prisma.admin_options.findFirst({
						where: {
							key: value,
							id: {
								not: parseInt(id, 10),
							},
						},
					});
					return !record || !record.id ? Boolean(1) : Boolean(0);
				},
			}),
		value: yup.string().notRequired(),
	}),
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_ADMIN_OPTION_ID,
				async test(value) {
					const record = await prisma.admin_options.findUnique({
						where: {
							id: parseInt(value, 10),
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
	}),
});

export const AdminOptionIdSchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_ADMIN_OPTION_ID,
				async test(value) {
					const record = await prisma.admin_options.findUnique({
						where: {
							id: parseInt(value, 10),
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
	}),
});

export const deleteAdminOptionsSchema = yup.object({
	body: yup.object({
		ids: yup
			.array()
			.of(
				yup
					.number()
					.integer()
					.required(REQUIRED_FIELDS)
					.test(
						'is-valid-adminOption',
						INVALID_ADMIN_OPTION_ID,
						async value => {
							if (!value) return false;
							const record = await prisma.admin_options.findUnique({
								where: {
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
