import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { MENU_NOT_FOUND } from '../constants';
import { AppError } from '../errors';

const prisma = new PrismaClient();

export class MenuService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllMenus() {
		const { query } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;

		const options = {
			where: {
				deleted: false,
			},
		};

		if (search) {
			options.where.AND = Object.keys(search).map(key => ({
				[key]: { contains: search[key] },
			}));
		}
		if (sort) {
			const [field, direction] = sort.split(':');
			options.orderBy = [
				{
					[field]: direction,
				},
			];
		}

		const totalCount = await prisma.menu.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;
		options.select = {
			id: true,
			name: true,
			location: true,
			status: true,
			items: {
				select: {
					page: {
						select: {
							id: true,
							slug: true,
							title: true,
							url: true,
							type: true,
						},
					},
				},
				where: {
					parent_id: null,
				},
				// include: {
				// 	page: true,
				// 	parent: true,
				// 	children: true,
				// },
			},
		};
		// options.include = {
		// 	items: {
		// 		select: {
		// 			page: {
		// 				select: {
		// 					id: true,
		// 					slug: true,
		// 					title: true,
		// 					url: true,
		// 					type: true,
		// 				},
		// 			},
		// 		},
		// 		where: {
		// 			parent_id: null,
		// 		},
		// 		// include: {
		// 		// 	page: true,
		// 		// 	parent: true,
		// 		// 	children: true,
		// 		// },
		// 	},
		// };

		const allRecords = await prisma.menu.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(MENU_NOT_FOUND, HttpStatus.NOT_FOUND, allRecords);

		return {
			records: allRecords,
			totalRecords: totalCount,
			totalPages,
			query,
		};
	}

	async getMenu() {
		const { id } = this.req.params;
		const record = await prisma.menu.findUnique({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			include: {
				items: {
					include: {
						page: true,
						parent: true,
						children: true,
					},
				},
			},
		});
		if (!record || !record.id)
			throw new AppError(MENU_NOT_FOUND, HttpStatus.NOT_FOUND);
		return record;
	}

	async getMenuByLocation() {
		const { location } = this.req.params;
		const record = await prisma.menu.findFirst({
			where: {
				deleted: false,
				location,
			},
			select: {
				id: true,
				name: true,
				location: true,
				status: true,
				items: {
					select: {
						sort: true,
						page: {
							select: {
								id: true,
								slug: true,
								title: true,
								url: true,
								type: true,
							},
						},
					},
					orderBy: {
						sort: 'asc',
					},
					where: {
						parent_id: null,
					},
				},
			},
		});
		if (!record || !record.id)
			throw new AppError(MENU_NOT_FOUND, HttpStatus.NOT_FOUND);
		return record;
	}

	async createMenu() {
		const { body } = this.req;

		const record = await prisma.menu.create({
			data: {
				name: body.name,
				location: body.location,
				content: body.content,
				status: body.status,
			},
		});

		const menuItemData = body.menuItems.map(item => ({
			menu_id: record.id,
			title: item.title,
			sort: item.sort,
			...(item?.url ? { url: item.url } : {}),
			...(item?.page_id ? { page_id: item.page_id } : {}),
		}));

		await prisma.menu_item.createMany({
			data: menuItemData,
		});

		return { record };
	}

	async updateMenu() {
		const { id } = this.req.params;
		const { body } = this.req;

		const updateRecord = await prisma.menu.update({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			data: {
				...(body?.name ? { name: body.name } : {}),
				...(body?.location ? { location: body.location } : {}),
				...(body?.content ? { content: body.content } : {}),
				...(body?.status ? { status: body.status } : {}),
			},
		});

		if (body.menuItems) {
			await prisma.menu_item.deleteMany({
				where: {
					menu_id: parseInt(id, 10),
				},
			});

			const menuItemData = body.menuItems.map(item => ({
				menu_id: parseInt(id, 10),
				title: item.title,
				sort: item.sort,
				...(item?.url ? { url: item.url } : {}),
				...(item?.page_id ? { page_id: item.page_id } : {}),
			}));

			await prisma.menu_item.createMany({
				data: menuItemData,
			});
		}

		return updateRecord;
	}

	async deleteMenu() {
		const { id } = this.req.params;

		await prisma.menu.update({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			data: {
				deleted: true,
			},
		});

		return null;
	}

	async deleteManyMenu() {
		const { ids } = this.req.body;

		await prisma.menu.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data: {
				deleted: true,
			},
		});

		return null;
	}
}
