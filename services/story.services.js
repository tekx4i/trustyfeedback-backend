import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { STORY_NOT_FOUND } from '../constants';
import { AppError } from '../errors';

const prisma = new PrismaClient();

export class StoryService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllStories() {
		const { query, user } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;

		const options = {
			where: {
				isActive: true,
				...(user && user.role_id !== 1 ? { author_id: user.id } : {}),
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

		const totalCount = await prisma.story.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;
		options.include = {
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
			// 	},
			// },
			_count: {
				select: {
					like: true,
					comments: true,
				},
			},
		};

		if (user?.id) {
			options.include.like = {
				where: {
					author_id: user.id,
				},
			};
		}

		const allRecords = await prisma.story.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(STORY_NOT_FOUND, HttpStatus.NOT_FOUND, allRecords);

		return {
			records: allRecords,
			totalRecords: totalCount,
			totalPages,
			query,
		};
	}

	async getStory() {
		const { user } = this.req;
		const { id } = this.req.params;
		const options = {
			where: {
				isActive: true,
				id: parseInt(id, 10),
			},
			include: {
				author: {
					select: {
						name: true,
						image: true,
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
					},
				},
				_count: {
					select: {
						like: true,
					},
				},
			},
		};
		const record = await prisma.story.findUnique(options);
		if (!record || !record.id)
			throw new AppError(STORY_NOT_FOUND, HttpStatus.NOT_FOUND);
		return record;
	}

	async createStory() {
		const { user, body, file } = this.req;

		const record = await prisma.story.create({
			data: {
				author_id: user.id,
				...(file?.filename ? { imageUrl: file.filename } : {}),
				...body,
			},
		});

		return { record };
	}

	async updateStory() {
		const { id } = this.req.params;
		const { body, file } = this.req;

		const updateRecord = await prisma.story.update({
			where: {
				isActive: true,
				id: parseInt(id, 10),
			},
			data: {
				...(file?.filename ? { imageUrl: file.filename } : {}),
				...body,
			},
		});

		return updateRecord;
	}

	async deleteStory() {
		const { id } = this.req.params;

		await prisma.story.update({
			where: {
				isActive: true,
				id: parseInt(id, 10),
			},
			data: {
				isActive: false,
			},
		});

		return null;
	}

	async deleteManyStory() {
		const { ids } = this.req.body;

		await prisma.story.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data: {
				isActive: false,
			},
		});

		return null;
	}
}
