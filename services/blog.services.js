import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { BLOG_NOT_FOUND } from '../constants';
import { AppError } from '../errors';

const prisma = new PrismaClient();

export class BlogService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllBlogs() {
		const { query, user } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;

		const options = {
			where: {
				deleted: false,
				// created_by: user.id,
			},
		};

		if (search) {
			options.where.AND = Object.keys(search).map(key => {
				if (key === 'type' || key === 'category_id') {
					return { [key]: search[key] };
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

		const totalCount = await prisma.blog.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;
		options.include = {
			category: true,
			author: {
				select: {
					name: true,
					image: true,
				},
			},
			...(user?.id ? { like: { where: { author_id: user.id } } } : {}),
			// comments: {
			// 	include: {
			// 		...(user?.id ? { like: { where: { author_id: user.id } } } : {}),
			// 		_count: {
			// 			select: {
			// 				like: true,
			// 			},
			// 		},
			// 		author: {
			// 			select: {
			// 				name: true,
			// 				image: true,
			// 				email: true,
			// 			},
			// 		},
			// 	},
			// },
			_count: {
				select: {
					like: true,
				},
			},
		};
		const allRecords = await prisma.blog.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(BLOG_NOT_FOUND, HttpStatus.NOT_FOUND, allRecords);

		return {
			records: allRecords,
			totalRecords: totalCount,
			totalPages,
			query,
		};
	}

	async getBlog() {
		const { user } = this.req;
		const { id } = this.req.params;
		const include = {
			author: {
				select: {
					name: true,
					image: true,
					email: true,
				},
			},
			...(user?.id ? { like: { where: { author_id: user.id } } } : {}),
			comments: {
				include: {
					...(user?.id ? { like: { where: { author_id: user.id } } } : {}),
					_count: {
						select: {
							like: true,
						},
					},
					author: {
						select: {
							name: true,
							image: true,
							email: true,
						},
					},
					replies: {
						include: {
							...(user?.id ? { like: { where: { author_id: user.id } } } : {}),
							_count: {
								select: {
									like: true,
								},
							},
							author: {
								select: {
									name: true,
									image: true,
									email: true,
								},
							},
						},
					},
				},
			},
			_count: {
				select: {
					like: true,
				},
			},
		};
		const options = {
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			include,
		};

		const record = await prisma.blog.findUnique(options);
		if (!record || !record.id)
			throw new AppError(BLOG_NOT_FOUND, HttpStatus.NOT_FOUND);

		record.related = await prisma.blog.findMany({
			where: {
				deleted: false,
				id: { not: record.id },
				type: record.type,
				category: record.category,
				// id: parseInt(id, 10),
			},
			include,
		});

		return record;
	}

	async createBlog() {
		const { user, body, file } = this.req;
		const record = await prisma.blog.create({
			data: {
				author_id: user.id,
				...(file?.filename ? { file_url: file.filename } : {}),
				...(file?.mimetype ? { file_type: file.mimetype } : {}),
				...body,
			},
		});

		return { record };
	}

	async updateBlog() {
		const { id } = this.req.params;
		const { body, file } = this.req;

		const updateRecord = await prisma.blog.update({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			data: {
				...(file?.filename ? { file_url: file.filename } : {}),
				...(file?.mimetype ? { file_type: file.mimetype } : {}),
				...body,
			},
		});

		return updateRecord;
	}

	async deleteBlog() {
		const { id } = this.req.params;

		await prisma.blog.update({
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

	async deleteManyBlog() {
		const { ids } = this.req.body;

		await prisma.blog.updateMany({
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
