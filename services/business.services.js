import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { BUSINESS_NOT_FOUND } from '../constants';
import { AppError } from '../errors';

const prisma = new PrismaClient();

export class BusinessService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllBusinesss() {
		const { query, user } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, favorite, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;

		const options = {
			where: {
				deleted: false,
				...(user?.id && favorite
					? { favorites: { some: { user_id: user.id } } }
					: {}),
			},
		};

		if (search) {
			options.where.AND = Object.keys(search).map(key => {
				if (key === 'category') {
					return {
						categories: {
							some: {
								category_id: parseInt(search[key], 10),
							},
						},
					};
				}
				if (key === 'categories') {
					const categories = search[key].map(category =>
						parseInt(category, 10),
					);
					return {
						AND: categories.map(categoryId => ({
							categories: {
								some: {
									category_id: categoryId,
								},
							},
						})),
					};
				}
				if (key === 'rating') {
					return { [key]: { gte: search[key] } };
				}
				if (key === 'country') {
					return { [key]: search[key] };
				}
				// if(key === 'country'){
				// 	return { user: { some: { [key]: search[key] } } };
				// }
				// if(key === 'postal_code' || key === 'city'){
				// 	return { user: { some: { [key]: { contains: search[key] } } } };
				// }
				if (key === 'has_reviews') {
					return { reviews: { some: { approved: true, deleted: false } } };
				}
				return { [key]: { contains: search[key] } };
			});
		}
		if (sort) {
			const [field, direction] = sort.split(':');
			options.orderBy = [
				{
					[field]: direction,
				},
			];
		}

		const totalCount = await prisma.business.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;
		options.include = {
			// categories: {
			// 	include: {
			// 		category: true,
			// 	},
			// },
			// user: {
			// 	select: {
			// 		name: true,
			// 		email: true,
			// 		image: true,
			// 		verified_status: true,
			// 	},
			// },
			// reviews: {
			// 	where: {
			// 		deleted: false,
			// 		approved: true,
			// 		status: 'ACTIVE',
			// 	},
			// 	include: {
			// 		user: {
			// 			select: {
			// 				name: true,
			// 				email: true,
			// 				image: true,
			// 				// roles: true,
			// 				verified_status: true,
			// 			},
			// 		},
			// 	},
			// },
			...(user?.id ? { like: { where: { author_id: user.id } } } : {}),
			...(user?.id ? { favorites: { where: { user_id: user.id } } } : {}),
			comments: {
				include: {
					...(user?.id ? { like: { where: { author_id: user.id } } } : {}),
					_count: {
						select: {
							like: true,
						},
					},
				},
			},
			_count: {
				select: {
					reviews: {
						where: {
							deleted: false,
							approved: true,
							status: 'ACTIVE',
						},
					},
					like: true,
				},
			},
		};

		const allRecords = await prisma.business.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(BUSINESS_NOT_FOUND, HttpStatus.NOT_FOUND, allRecords);

		return {
			records: allRecords,
			totalRecords: totalCount,
			totalPages,
			query,
		};
	}

	async getBusiness() {
		const { user } = this.req;
		const { id } = this.req.params;

		const options = {
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			include: {
				categories: {
					include: {
						category: true,
					},
				},
				// user: {
				// 	select: {
				// 		name: true,
				// 		email: true,
				// 		image: true,
				// 		verified_status: true,
				// 	},
				// },
				// reviews: {
				// 	where: {
				// 		deleted: false,
				// 		approved: true,
				// 		status: 'ACTIVE',
				// 	},
				// 	include: {
				// 		user: {
				// 			select: {
				// 				name: true,
				// 				email: true,
				// 				image: true,
				// 				roles: true,
				// 				verified_status: true,
				// 			},
				// 		},
				// 	},
				// },
				...(user?.id ? { like: { where: { author_id: user.id } } } : {}),
				...(user?.id ? { favorites: { where: { user_id: user.id } } } : {}),
				comments: {
					include: {
						...(user?.id ? { like: { where: { author_id: user.id } } } : {}),
						_count: {
							select: {
								like: true,
							},
						},
					},
				},
				_count: {
					select: {
						reviews: {
							where: {
								deleted: false,
								approved: true,
								status: 'ACTIVE',
							},
						},
					},
				},
			},
		};

		const record = await prisma.business.findUnique(options);
		if (!record || !record.id)
			throw new AppError(BUSINESS_NOT_FOUND, HttpStatus.NOT_FOUND);

		const businessUser = await prisma.user.findFirst({
			where: { business_id: id },
		});
		record.business_email = businessUser?.email ?? null;

		const categoryIds = record.categories.map(bc => bc.category_id);

		record.related = await prisma.business.findMany({
			where: {
				deleted: false,
				id: { not: record.id },
				categories: {
					some: {
						category_id: { in: categoryIds },
					},
				},
			},
			take: 5,
			orderBy: {
				rating: 'desc',
			},
			include: {
				// categories: {
				// 	include: {
				// 		category: true,
				// 	},
				// },
				// user: {
				// 	select: {
				// 		name: true,
				// 		email: true,
				// 		image: true,
				// 		verified_status: true,
				// 	},
				// },
				// reviews: {
				// 	where: {
				// 		deleted: false,
				// 		approved: true,
				// 		status: 'ACTIVE',
				// 	},
				// 	include: {
				// 		user: {
				// 			select: {
				// 				name: true,
				// 				email: true,
				// 				image: true,
				// 				roles: true,
				// 				verified_status: true,
				// 			},
				// 		},
				// 	},
				// },
				...(user?.id ? { like: { where: { author_id: user.id } } } : {}),
				...(user?.id ? { favorites: { where: { user_id: user.id } } } : {}),
				// comments: {
				// 	include: {
				// 		...(user?.id ? { like: { where: { author_id: user.id } } } : {}),
				// 		_count: {
				// 			select: {
				// 				like: true,
				// 			},
				// 		},
				// 	},
				// },
				_count: {
					select: {
						reviews: {
							where: {
								deleted: false,
								approved: true,
								status: 'ACTIVE',
							},
						},
						like: true,
					},
				},
			},
		});

		return record;
	}

	async getBusinessInfo() {
		const { key } = this.req.params;

		const record = await prisma.business.findUnique({
			where: {
				deleted: false,
				key,
			},
			select: {
				id: true,
				name: true,
				description: true,
				website: true,
				image: true,
				rating: true,
				verified_status: true,
				_count: {
					select: {
						reviews: {
							where: {
								deleted: false,
								approved: true,
								status: 'ACTIVE',
							},
						},
					},
				},
			},
		});
		if (!record || !record.id)
			throw new AppError(BUSINESS_NOT_FOUND, HttpStatus.NOT_FOUND);

		return record;
	}

	async setBusinessFavorite() {
		const { id } = this.req.params;
		const { user } = this.req;

		const record = await prisma.favorites.findFirst({
			where: {
				user_id: user.id,
				business_id: id,
			},
			include: {
				// user: true,
				business: true,
			},
		});
		if (record && record.id) return record;

		const favorite = await prisma.favorites.create({
			data: {
				user_id: user.id,
				business_id: id,
			},
		});

		const data = await prisma.favorites.findUnique({
			where: {
				id: favorite.id,
			},
			include: {
				// user: true,
				business: true,
			},
		});
		return data;
	}

	async removeFavoriteBusiness() {
		const { id } = this.req.params;
		const { user } = this.req;

		const record = await prisma.favorites.findFirst({
			where: {
				user_id: user.id,
				business_id: id,
			},
		});
		if (record && record.id) {
			await prisma.favorites.delete({
				where: {
					id: record.id,
				},
			});
		}

		return null;
	}

	async createBusiness() {
		const { body } = this.req;

		const record = await prisma.business.create({
			data: {
				...body,
			},
		});

		return { record };
	}

	async updateBusiness() {
		const { id } = this.req.params;
		const { body, file } = this.req;

		const updateRecord = await prisma.business.update({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			data: {
				...(file?.filename ? { image: file.filename } : {}),
				...body,
			},
		});

		// const updateUser = await prisma.user.update({
		// 	where: {
		// 		deleted: false,
		// 		business_id: parseInt(id, 10),
		// 	},
		// 	data: {
		// 		...(file?.filename ? { image: file.filename} : {} ),
		// 		...(body.name ? { name:body.name } : {} ),
		// 		...(body.address ? { name:body.address } : {} ),
		// 		...(body.phone ? { number:body.phone } : {} ),
		// 	},
		// });

		return updateRecord;
	}

	async deleteBusiness() {
		const { id } = this.req.params;

		await prisma.business.update({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			data: {
				deleted: true,
			},
		});

		await prisma.user.updateMany({
			where: {
				business_id: parseInt(id, 10),
			},
			data: {
				deleted: true,
			},
		});

		return null;
	}

	async deleteManyBusiness() {
		const { ids } = this.req.body;

		await prisma.business.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data: {
				deleted: true,
			},
		});

		await prisma.user.updateMany({
			where: {
				business_id: {
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
