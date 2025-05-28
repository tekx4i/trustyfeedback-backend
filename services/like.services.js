import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { LIKE_NOT_FOUND } from '../constants';
import { AppError } from '../errors';

const prisma = new PrismaClient();

export class LikeService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllLikes() {
		const { query } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;

		const options = {
			where: {},
		};

		if (search) {
			options.where.AND = Object.keys(search).map(key => {
				if (
					key === 'author_id' ||
					key === 'business_id' ||
					key === 'blog_id' ||
					key === 'review_id' ||
					key === 'story_id' ||
					key === 'comment_id'
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

		const totalCount = await prisma.like.count(options);

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
			business: true,
			blog: true,
			review: true,
			story: true,
			comment: true,
		};

		const allRecords = await prisma.like.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(LIKE_NOT_FOUND, HttpStatus.NOT_FOUND, allRecords);

		return {
			records: allRecords,
			totalRecords: totalCount,
			totalPages,
			query,
		};
	}

	async getLike() {
		const { id } = this.req.params;
		const record = await prisma.like.findUnique({
			where: {
				id: parseInt(id, 10),
			},
			include: {
				author: {
					select: {
						name: true,
						image: true,
					},
				},
				business: true,
				blog: true,
				review: true,
				story: true,
				comment: true,
			},
		});
		if (!record || !record.id)
			throw new AppError(LIKE_NOT_FOUND, HttpStatus.NOT_FOUND);
		return record;
	}

	async createLike() {
		const { body, user } = this.req;

		const likeData = await prisma.like.findFirst({
			where: {
				author_id: user.id,
				...(body.business_id ? { business_id: body.business_id } : {}),
				...(body.blog_id ? { blog_id: body.blog_id } : {}),
				...(body.review_id ? { review_id: body.review_id } : {}),
				...(body.story_id ? { story_id: body.story_id } : {}),
				...(body.comment_id ? { comment_id: body.comment_id } : {}),
			},
		});

		if (likeData || likeData?.id) return likeData;

		const record = await prisma.like.create({
			data: {
				author_id: user.id,
				...body,
			},
		});

		return { record };
	}

	async deleteLike() {
		const { id } = this.req.params;

		await prisma.like.delete({
			where: {
				id: parseInt(id, 10),
			},
		});

		return null;
	}

	async deleteByData() {
		const { body, user } = this.req;

		await prisma.like.deleteMany({
			where: {
				author_id: user.id,
				...(body.business_id ? { business_id: body.business_id } : {}),
				...(body.blog_id ? { blog_id: body.blog_id } : {}),
				...(body.review_id ? { review_id: body.review_id } : {}),
				...(body.story_id ? { story_id: body.story_id } : {}),
				...(body.comment_id ? { comment_id: body.comment_id } : {}),
			},
		});

		return null;
	}
}
