import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { COMMENT_NOT_FOUND } from '../constants';
import { AppError } from '../errors';
import { notification } from '../utils';

const prisma = new PrismaClient();

export class CommentService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllComments() {
		const { query, user } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;

		const options = {
			where: {
				parent_id: null,
			},
		};

		if (search) {
			options.where.AND = Object.keys(search).map(key => {
				if (
					key === 'author_id' ||
					key === 'parent_id' ||
					key === 'business_id' ||
					key === 'blog_id' ||
					key === 'review_id' ||
					key === 'story_id'
				) {
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

		const totalCount = await prisma.comment.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;
		options.include = {
			parent: true,
			author: {
				select: {
					name: true,
					image: true,
				},
			},
			replies: true,
			business: true,
			blog: true,
			review: {
				include: {
					user: {
						select: {
							name: true,
							image: true,
						},
					},
				},
			},
			story: true,
			...(user?.id ? { like: { where: { author_id: user.id } } } : {}),
			_count: {
				select: {
					like: true,
				},
			},
		};

		const allRecords = await prisma.comment.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND, allRecords);

		return {
			records: allRecords,
			totalRecords: totalCount,
			totalPages,
			query,
		};
	}

	async getComment() {
		const { user } = this.req;
		const { id } = this.req.params;
		const options = {
			where: {
				id: parseInt(id, 10),
			},
			include: {
				parent: true,
				author: {
					select: {
						name: true,
						image: true,
					},
				},
				...(user?.id ? { like: { where: { author_id: user.id } } } : {}),
				replies: true,
				business: true,
				blog: true,
				review: true,
				story: true,
				_count: {
					select: {
						like: true,
					},
				},
			},
		};
		const record = await prisma.comment.findUnique(options);
		if (!record || !record.id)
			throw new AppError(COMMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
		return record;
	}

	async createComment() {
		const { body, user } = this.req;

		const record = await prisma.comment.create({
			data: {
				author_id: user.id,
				...body,
			},
		});

		const options = {
			where: {
				id: parseInt(record.id, 10),
			},
			include: {
				parent: true,
				business: {
					include: {
						user: {
							select: {
								name: true,
								image: true,
								email: true,
								id: true,
							},
						},
					},
				},
				blog: true,
				review: {
					include: {
						user: {
							select: {
								name: true,
								image: true,
								email: true,
								id: true,
							},
						},
					},
				},
				story: {
					include: {
						author: {
							select: {
								name: true,
								image: true,
								id: true,
							},
						},
					},
				},
				_count: {
					select: {
						like: true,
					},
				},
			},
		};
		const data = await prisma.comment.findUnique(options);

		if (data?.business?.user?.length > 0) {
			notification(data.business.user[0], 'app', {
				message: `${user.name} commented on your business`,
			});
		}
		if (data?.review?.user?.id > 0) {
			notification(data.review.user, 'app', {
				message: `${user.name} commented on your review`,
			});
		}
		if (data?.story?.author?.id > 0) {
			notification(data.story.author, 'app', {
				message: `${user.name} commented on your story`,
			});
		}

		return { record };
	}

	async updateComment() {
		const { id } = this.req.params;
		const { body } = this.req;

		const updateRecord = await prisma.comment.update({
			where: {
				id: parseInt(id, 10),
			},
			data: body,
		});

		return updateRecord;
	}

	async deleteComment() {
		const { id } = this.req.params;

		await prisma.comment.delete({
			where: {
				id: parseInt(id, 10),
			},
		});

		return null;
	}

	async deleteManyComment() {
		const { ids } = this.req.body;

		await prisma.comment.deleteMany({
			where: {
				id: {
					in: ids,
				},
			},
		});

		return null;
	}
}
