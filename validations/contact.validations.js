import { PrismaClient } from '@prisma/client';
import yup from 'yup';

import {
	REQUIRED_FIELDS,
	INVALID_CONTACT_ID,
	GET_CONTACT_QUERY_SCHEMA_CONFIG,
	INTEGER_ERROR,
} from '../constants';
import { createQueryParamsSchema } from '../utils';

const prisma = new PrismaClient();

export const getContactSchema = yup.object({
	query: createQueryParamsSchema(GET_CONTACT_QUERY_SCHEMA_CONFIG),
});

export const addContactSchema = yup.object({
	body: yup.object({
		name: yup.string().required(REQUIRED_FIELDS),
		email: yup.string().required(REQUIRED_FIELDS),
		message: yup.string().required(REQUIRED_FIELDS),
		business_id: yup
			.string()
			.notRequired()
			.test({
				name: 'valid-business',
				message: INVALID_CONTACT_ID,
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
	}),
	file: yup.mixed(),
});

export const updateContactSchema = yup.object({
	body: yup.object({
		response: yup.string().notRequired(),
		status: yup.string().notRequired(),
	}),
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_CONTACT_ID,
				async test(value) {
					const record = await prisma.contact.findUnique({
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

export const ContactIdSchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_CONTACT_ID,
				async test(value) {
					const record = await prisma.contact.findUnique({
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

export const deleteContactsSchema = yup.object({
	body: yup.object({
		ids: yup.array().required(REQUIRED_FIELDS),
	}),
});
