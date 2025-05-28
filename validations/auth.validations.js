import { PrismaClient } from '@prisma/client';
import yup from 'yup';

import {
	GENDERS,
	ALL_STATUS,
	EMAIL_EXISTS,
	INVALID_ROLE,
	INVALID_EMAIL,
	INVALID_GENDER,
	USER_NOT_FOUND,
	INVALID_STATUS,
	REQUIRED_FIELDS,
	INVALID_DATE_FORMAT,
	PASSWORD_MIN_LENGTH,
	INVALID_CATEGORY_ID,
	GET_USER_QUERY_SCHEMA_CONFIG,
	GET_USER_PACKAGE_QUERY_SCHEMA_CONFIG,
} from '../constants';
import { createQueryParamsSchema } from '../utils';

const prisma = new PrismaClient();

export const loginSchema = yup.object().shape({
	body: yup.object().shape({
		email: yup.string().email(INVALID_EMAIL).required(),
		password: yup
			.string()
			.required(REQUIRED_FIELDS)
			.min(6, PASSWORD_MIN_LENGTH),
	}),
});

export const getUsersSchema = yup.object({
	query: createQueryParamsSchema(GET_USER_QUERY_SCHEMA_CONFIG),
});

export const getPackagesSchema = yup.object({
	query: createQueryParamsSchema(GET_USER_PACKAGE_QUERY_SCHEMA_CONFIG),
});

export const registerSchema = yup.object({
	body: yup.object({
		name: yup.string().required(REQUIRED_FIELDS),
		email: yup
			.string()
			.email(INVALID_EMAIL)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: EMAIL_EXISTS,
				async test(value) {
					const record = await prisma.user.findFirst({
						where: {
							// deleted: false,
							email: value,
						},
					});
					return !record || !record.id ? Boolean(1) : Boolean(0);
				},
			}),
		password: yup.string().required().min(6),
		role_id: yup
			.number()
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_ROLE,
				async test(value) {
					if (value === 1) return Boolean(0);
					const record = await prisma.roles.findFirst({
						where: {
							deleted: false,
							id: value,
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
		number: yup.string().notRequired(),
		birth_date: yup
			.string()
			.notRequired()
			.matches(/^\d{4}-\d{2}-\d{2}$/, INVALID_DATE_FORMAT),
		gender: yup.string().notRequired().oneOf(GENDERS, INVALID_GENDER),
		address: yup.string().notRequired(),
		postal_code: yup.string().notRequired(),
		city: yup.string().notRequired(),
		state: yup.string().notRequired(),
		country: yup.string().notRequired(),
		business_name: yup.string().when('role_id', {
			is: 3,
			then: schema => schema.required(REQUIRED_FIELDS),
			otherwise: schema => schema.optional(),
		}),
		business_address: yup.string().when('role_id', {
			is: 3,
			then: schema => schema.required(REQUIRED_FIELDS),
			otherwise: schema => schema.optional(),
		}),
		business_phone: yup.string().when('role_id', {
			is: 3,
			then: schema => schema.required(REQUIRED_FIELDS),
			otherwise: schema => schema.optional(),
		}),
		business_website: yup.string().when('role_id', {
			is: 3,
			then: schema => schema.required(REQUIRED_FIELDS),
			otherwise: schema => schema.optional(),
		}),
		business_description: yup.string().notRequired(),
		business_categories: yup
			.array()
			.of(
				yup
					.number()
					.integer()
					.required(REQUIRED_FIELDS)
					.test('is-valid-category', INVALID_CATEGORY_ID, async value => {
						if (!value) return false;
						const record = await prisma.category.findUnique({
							where: {
								id: parseInt(value, 10),
							},
						});
						return !record || !record.id ? Boolean(0) : Boolean(1);
					}),
			)
			.when('role_id', {
				is: 3,
				then: schema => schema.required(REQUIRED_FIELDS),
				otherwise: schema => schema.optional(),
			}),
	}),
});

export const verifySchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.integer('User ID must be an integer.')
			.max(99999999999)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: USER_NOT_FOUND,
				async test(value) {
					const record = await prisma.user.findFirst({
						where: {
							deleted: false,
							id: parseInt(value, 10),
							status: {
								not: 'BLOCKED',
							},
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
	}),
	body: yup.object({
		otp: yup.string().min(4).max(4).required(REQUIRED_FIELDS),
	}),
});

export const userIdSchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.integer('User ID must be an integer.')
			.max(99999999999)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: USER_NOT_FOUND,
				async test(value) {
					const record = await prisma.user.findFirst({
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

export const resendOTPSchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.integer('User ID must be an integer.')
			.max(99999999999)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: USER_NOT_FOUND,
				async test(value) {
					const record = await prisma.user.findFirst({
						where: {
							deleted: false,
							id: parseInt(value, 10),
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
	}),
	query: yup.object({
		type: yup.string().notRequired(),
	}),
});

export const updateUserSchema = yup.object({
	body: yup.object({
		name: yup.string().notRequired(),
		number: yup.string().notRequired(),
		password: yup.string().notRequired().min(6),
		birth_date: yup
			.string()
			.notRequired()
			.matches(/^\d{4}-\d{2}-\d{2}$/, INVALID_DATE_FORMAT),
		gender: yup.string().notRequired().oneOf(GENDERS, INVALID_GENDER),
		status: yup.string().notRequired().oneOf(ALL_STATUS, INVALID_STATUS),
		address: yup.string().notRequired(),
		postal_code: yup.string().notRequired(),
		city: yup.string().notRequired(),
		state: yup.string().notRequired(),
		country: yup.string().notRequired(),
		approved: yup.boolean().notRequired(),
		role_id: yup
			.number()
			.notRequired()
			.test({
				name: 'valid-form',
				message: INVALID_ROLE,
				async test(value) {
					if (value === undefined || value === null) {
						return true;
					}
					const record = await prisma.roles.findFirst({
						where: {
							deleted: false,
							id: value,
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
		business_name: yup.string().notRequired(),
		business_address: yup.string().notRequired(),
		business_phone: yup.string().notRequired(),
		business_website: yup.string().notRequired(),
		business_description: yup.string().notRequired(),
		business_categories: yup
			.array()
			.of(
				yup
					.number()
					.integer()
					.required(REQUIRED_FIELDS)
					.test('is-valid-category', INVALID_CATEGORY_ID, async value => {
						if (!value) return false;
						const record = await prisma.category.findUnique({
							where: {
								id: parseInt(value, 10),
							},
						});
						return !record || !record.id ? Boolean(0) : Boolean(1);
					}),
			)
			.notRequired(),
	}),
	params: yup.object({
		id: yup
			.number()
			.integer('User ID must be an integer.')
			.max(99999999999)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: USER_NOT_FOUND,
				async test(value) {
					const record = await prisma.user.findFirst({
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

export const updateManyUserSchema = yup.object({
	body: yup.object({
		ids: yup.array().required(REQUIRED_FIELDS),
		// name: yup.string().notRequired(),
		// number: yup.string().notRequired(),
		password: yup.string().notRequired().min(6),
		gender: yup.string().notRequired().oneOf(GENDERS, INVALID_GENDER),
		status: yup.string().notRequired().oneOf(ALL_STATUS, INVALID_STATUS),
		address: yup.string().notRequired(),
		postal_code: yup.string().notRequired(),
		city: yup.string().notRequired(),
		state: yup.string().notRequired(),
		country: yup.string().notRequired(),
		approved: yup.boolean().notRequired(),
		role_id: yup
			.number()
			.notRequired()
			.test({
				name: 'valid-form',
				message: INVALID_ROLE,
				async test(value) {
					if (value === undefined || value === null) {
						return true;
					}
					const record = await prisma.roles.findFirst({
						where: {
							deleted: false,
							id: value,
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
		business_name: yup.string().notRequired(),
		business_address: yup.string().notRequired(),
		business_phone: yup.string().notRequired(),
		business_website: yup.string().notRequired(),
		business_description: yup.string().notRequired(),
		business_categories: yup
			.array()
			.of(
				yup
					.number()
					.integer()
					.required(REQUIRED_FIELDS)
					.test('is-valid-category', INVALID_CATEGORY_ID, async value => {
						if (!value) return false;
						const record = await prisma.category.findUnique({
							where: {
								id: parseInt(value, 10),
							},
						});
						return !record || !record.id ? Boolean(0) : Boolean(1);
					}),
			)
			.notRequired(),
	}),
});

export const updateProfileSchema = yup.object({
	body: yup.object({
		name: yup.string().notRequired(),
		number: yup.string().notRequired(),
		password: yup.string().notRequired().min(6),
		birth_date: yup
			.string()
			.notRequired()
			.matches(/^\d{4}-\d{2}-\d{2}$/, INVALID_DATE_FORMAT),
		gender: yup.string().notRequired().oneOf(GENDERS, INVALID_GENDER),
		status: yup.string().notRequired().oneOf(ALL_STATUS, INVALID_STATUS),
		address: yup.string().notRequired(),
		postal_code: yup.string().notRequired(),
		city: yup.string().notRequired(),
		state: yup.string().notRequired(),
		country: yup.string().notRequired(),
		approved: yup.boolean().notRequired(),
		role_id: yup
			.number()
			.notRequired()
			.test({
				name: 'valid-form',
				message: INVALID_ROLE,
				async test(value) {
					if (value === undefined || value === null) {
						return true;
					}
					const record = await prisma.roles.findFirst({
						where: {
							deleted: false,
							id: value,
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
		business_name: yup.string().notRequired(),
		business_address: yup.string().notRequired(),
		business_phone: yup.string().notRequired(),
		business_website: yup.string().notRequired(),
		business_description: yup.string().notRequired(),
		business_categories: yup
			.array()
			.of(
				yup
					.number()
					.integer()
					.required(REQUIRED_FIELDS)
					.test('is-valid-category', INVALID_CATEGORY_ID, async value => {
						if (!value) return false;
						const record = await prisma.category.findUnique({
							where: {
								id: parseInt(value, 10),
							},
						});
						return !record || !record.id ? Boolean(0) : Boolean(1);
					}),
			)
			.notRequired(),
	}),
	file: yup.mixed(),
});

export const forgotSchema = yup.object({
	body: yup.object({
		email: yup
			.string()
			.email(INVALID_EMAIL)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: USER_NOT_FOUND,
				async test(value) {
					const record = await prisma.user.findFirst({
						where: {
							deleted: false,
							email: value,
							status: {
								not: 'BLOCKED',
							},
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
	}),
});

export const resetSchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.integer('User ID must be an integer.')
			.max(99999999999)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: USER_NOT_FOUND,
				async test(value) {
					const record = await prisma.user.findFirst({
						where: {
							deleted: false,
							id: parseInt(value, 10),
							status: {
								not: 'BLOCKED',
							},
						},
					});
					return !record || !record.id ? Boolean(0) : Boolean(1);
				},
			}),
	}),
	body: yup.object({
		password: yup.string().required(REQUIRED_FIELDS).min(6),
	}),
});

export const deleteUsersSchema = yup.object({
	body: yup.object({
		ids: yup.array().required(REQUIRED_FIELDS),
	}),
});
