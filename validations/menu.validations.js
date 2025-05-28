import { PrismaClient } from '@prisma/client';
import yup from 'yup';

import {
	INTEGER_ERROR,
	REQUIRED_FIELDS,
	INVALID_MENU_ID,
	INVALID_PAGE_ID,
	GET_MENU_QUERY_SCHEMA_CONFIG,
} from '../constants';
import { createQueryParamsSchema } from '../utils';

const prisma = new PrismaClient();

export const getMenuSchema = yup.object({
	query: createQueryParamsSchema(GET_MENU_QUERY_SCHEMA_CONFIG),
});

export const addMenuSchema = yup.object({
	body: yup.object({
		name: yup.string().required(REQUIRED_FIELDS),
		location: yup.string().required(REQUIRED_FIELDS),
		content: yup.string().notRequired(),
		status: yup.string().default('ACTIVE'),
		menuItems: yup
			.array()
			.of(
				yup.object({
					// title: yup.string().required(REQUIRED_FIELDS),
					sort: yup.number().integer(INTEGER_ERROR).required(REQUIRED_FIELDS),
					// url: yup.string().notRequired(),
					page_id: yup
						.number()
						.positive()
						.integer(INTEGER_ERROR)
						.required(REQUIRED_FIELDS)
						.test({
							name: 'valid-form',
							message: INVALID_PAGE_ID,
							async test(value) {
								if (!value) return true;
								const record = await prisma.page.findUnique({
									where: {
										isActive: true,
										id: parseInt(value, 10),
									},
								});
								return !record || !record.id ? Boolean(0) : Boolean(1);
							},
						}),
				}),
			)
			.required(REQUIRED_FIELDS),
	}),
	file: yup.mixed(),
});

export const updateMenuSchema = yup.object({
	body: yup.object({
		name: yup.string().notRequired(),
		location: yup.string().notRequired(),
		content: yup.string().notRequired(),
		status: yup.string().notRequired(),
		menuItems: yup
			.array()
			.of(
				yup.object({
					// title: yup.string().required(REQUIRED_FIELDS),
					sort: yup.number().integer(INTEGER_ERROR).required(REQUIRED_FIELDS),
					// url: yup.string().notRequired(),
					page_id: yup
						.number()
						.positive()
						.integer(INTEGER_ERROR)
						.required(REQUIRED_FIELDS)
						.test({
							name: 'valid-form',
							message: INVALID_PAGE_ID,
							async test(value) {
								if (!value) return true;
								const record = await prisma.page.findUnique({
									where: {
										isActive: true,
										id: parseInt(value, 10),
									},
								});
								return !record || !record.id ? Boolean(0) : Boolean(1);
							},
						}),
				}),
			)
			.notRequired(),
	}),
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_MENU_ID,
				async test(value) {
					const record = await prisma.menu.findUnique({
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

export const MenuIdSchema = yup.object({
	params: yup.object({
		id: yup
			.number()
			.positive()
			.integer(INTEGER_ERROR)
			.required(REQUIRED_FIELDS)
			.test({
				name: 'valid-form',
				message: INVALID_MENU_ID,
				async test(value) {
					const record = await prisma.menu.findUnique({
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

export const deleteMenusSchema = yup.object({
	body: yup.object({
		ids: yup.array().required(REQUIRED_FIELDS),
	}),
});
