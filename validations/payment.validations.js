import { PrismaClient } from '@prisma/client';
import yup from 'yup';

import {
	INTEGER_ERROR,
	REQUIRED_FIELDS,
	INVALID_PAYMENT_ID,
	INVALID_PACKAGE_ID,
	GET_PAYMENT_QUERY_SCHEMA_CONFIG,
} from '../constants';
import { createQueryParamsSchema } from '../utils';

const prisma = new PrismaClient();

export const getPaymentSchema = yup.object({
	query: createQueryParamsSchema(GET_PAYMENT_QUERY_SCHEMA_CONFIG),
});

export const addPaymentSchema = yup.object({
	body: yup.object({
		name: yup.string().required(REQUIRED_FIELDS),
		description: yup.string().required(REQUIRED_FIELDS),
	}),
	file: yup.mixed(),
});

export const createIntentSchema = yup.object({
	body: yup.object({
		package_id: yup
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

export const confirmPaymentSchema = yup.object({
	body: yup.object({
		paymentIntentId: yup.string().required(REQUIRED_FIELDS),
	}),
});

export const updatePaymentSchema = yup.object({
	body: yup.object({
		name: yup.string().notRequired(),
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
				message: INVALID_PAYMENT_ID,
				async test(value) {
					const record = await prisma.payment.findUnique({
						where: {
							is_deleted: 0,
							id: parseInt(value, 10),
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
	}),
	file: yup.mixed(),
});

export const PaymentIdSchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_PAYMENT_ID,
				async test(value) {
					const record = await prisma.payment.findUnique({
						where: {
							is_deleted: 0,
							id: parseInt(value, 10),
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
	}),
});

export const deletePaymentsSchema = yup.object({
	body: yup.object({
		ids: yup.array().required(REQUIRED_FIELDS),
	}),
});
