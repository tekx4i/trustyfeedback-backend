import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import { REVIEW_NOT_FOUND } from '../constants';
import { AppError } from '../errors';
import { createOTP, getAdminOption } from '../utils';

const prisma = new PrismaClient();

export class ReviewService {
	constructor(req) {
		this.req = req;
		this.body = req.body;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async getAllReviews() {
		const { query, user } = this.req;

		/* eslint-disable-next-line prefer-const */
		let { page, limit, sort, favorite, approved, ...search } = query;

		page = parseInt(page, 10) || 1;
		limit = parseInt(limit, 10) || 10;
		// const options = {
		// 	where: {
		// 		deleted: false,
		// 		...(!user?.id ? { approved: true, status: 'ACTIVE' } : {}),
		// 		...(favorite !== 'true' && user?.id
		// 			? user.role_id === 3 && user.business_id > 0
		// 				? { business_id: user.business_id, approved: true, status: 'ACTIVE' }
		// 				: user.role_id === 1
		// 					? {}
		// 					: { user_id: user.id }
		// 			: {}),
		// 		...(user?.id && approved && user.role_id !== 3
		// 			? { approved: approved === 'true' ? true : false }
		// 			: {}),
		// 		...(favorite === 'true' && user?.id ? {
		// 			favorites: {
		// 				some: {
		// 					user_id: user.id,
		// 					review_id: {
		// 						not: null
		// 					}
		// 				}
		// 			}
		// 		} : {}),
		// 	},
		// };
		const options = {
			where: {
				deleted: false,
			},
		};
		if (user?.id) {
			if (approved && user.role_id !== 3) {
				options.where.approved = approved === 'true';
			}
			if (favorite === 'true') {
				options.where.favorites = {
					some: {
						user_id: user.id,
						review_id: {
							not: null,
						},
					},
				};
			} else if (user.role_id === 3 && user.business_id > 0) {
				Object.assign(options.where, {
					business_id: user.business_id,
					approved: true,
					status: 'ACTIVE',
				});
			} else if (user.role_id !== 1) {
				options.where.user_id = user.id;
			}
		} else {
			Object.assign(options.where, {
				approved: true,
				status: 'ACTIVE',
			});
		}
		// console.dir(options, { depth: null });

		if (search) {
			options.where.AND = Object.keys(search).map(key => {
				if (key === 'created_at') {
					return { [key]: { gte: new Date(search[key]) } };
				}
				if (key === 'user_id' || key === 'business_id' || key === 'rating') {
					return { [key]: search[key] };
				}
				if (key === 'status') {
					return user?.role_id === 1 ? { [key]: search[key] } : {};
				}
				if (key === 'comments') {
					if (search[key] === 'true') {
						return { comments: { some: {} } };
					}
					return {};
				}
				return { [key]: { contains: search[key] } };
			});
		}

		const totalCount = await prisma.review.count(options);

		const totalPages = Math.ceil(totalCount / limit);

		options.skip = (page - 1) * limit;
		options.take = limit;

		if (sort) {
			const [field, direction] = sort.split(':');
			options.orderBy = [
				{
					[field]: direction,
				},
				!user?.id || user?.id !== 1 ? { verified_status: 'asc' } : {},
			];
		}

		options.include = {
			business: {
				select: {
					id: true,
					name: true,
					description: true,
					address: true,
					phone: true,
					website: true,
					image: true,
					rating: true,
					verified_status: true,
					email: true,
				},
			},
			images: true,
			user: {
				select: {
					name: true,
					email: true,
					image: true,
					// roles: true,
					verified_status: true,
					badge: true,
				},
			},
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
			...(user && user?.role_id === 1 ? { meta: true } : {}),
			_count: {
				select: {
					like: true,
				},
			},
		};

		const allRecords = await prisma.review.findMany(options);

		if (!allRecords || !Array.isArray(allRecords) || allRecords.length === 0)
			throw new AppError(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND, allRecords);

		return {
			records: allRecords,
			totalRecords: totalCount,
			totalPages,
			query,
		};
	}

	async getReview() {
		const { user } = this.req;
		const { id } = this.req.params;
		const options = {
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			include: {
				business: true,
				images: true,
				user: {
					select: {
						name: true,
						email: true,
						image: true,
						// roles: true,
						verified_status: true,
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
				...(user && user?.role_id === 1 ? { meta: true } : {}),
				_count: {
					select: {
						like: true,
					},
				},
			},
		};
		const record = await prisma.review.findUnique(options);
		if (!record || !record.id)
			throw new AppError(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
		return record;
	}

	async setReviewsFavorite() {
		const { id } = this.req.params;
		const { user } = this.req;

		const record = await prisma.favorites.findFirst({
			where: {
				user_id: user.id,
				review_id: id,
			},
			include: {
				// user: true,
				review: true,
			},
		});
		if (record && record.id) return record;

		const favorite = await prisma.favorites.create({
			data: {
				user_id: user.id,
				review_id: id,
			},
		});

		const data = await prisma.favorites.findUnique({
			where: {
				id: favorite.id,
			},
			include: {
				// user: true,
				review: true,
			},
		});
		return data;
	}

	async removeFavoriteReviews() {
		const { id } = this.req.params;
		const { user } = this.req;

		const record = await prisma.favorites.findFirst({
			where: {
				user_id: user.id,
				review_id: id,
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

	async createReview() {
		const { user, files } = this.req;
		const { info, ...body } = this.body;
		let weight = 1;

		const review = await prisma.review.findFirst({
			where: {
				business_id: body.business_id,
				user_id: user.id,
				...(body?.category_id ? { category_id: body.category_id } : {}),
			},
		});
		let record;
		let autoApprove = false;

		if (user.badge_id > 0) {
			const badge = await prisma.badge.findUnique({
				where: {
					is_deleted: false,
					id: user.badge_id,
				},
			});
			autoApprove = badge?.auto_approve ?? false;
		}
		autoApprove = user.verified_status === 'ACTIVE' ? true : autoApprove;

		weight = await this.calculateReviewWeight(body?.category_id);

		if (review && review?.id) {
			record = await prisma.review.update({
				where: {
					id: review.id,
					business_id: body.business_id,
					user_id: user.id,
					...(body?.category_id ? { category_id: body.category_id } : {}),
				},
				data: {
					rating: body.rating,
					comment: body.comment,
					...(body.title ? { title: body.title } : {}),
					...(body.latitude ? { latitude: body.latitude } : {}),
					...(body.longitude ? { longitude: body.longitude } : {}),
					status: 'PENDING',
					verified_status:
						user.verified_status === 'ACTIVE' ? 'ACTIVE' : 'PENDING',
					weight,
					deleted: false,
					...(autoApprove
						? { approved: true, approved_by: user.id }
						: { approved: false, approved_by: null }),
					created_at: new Date(),
				},
			});
			if (info) {
				await prisma.review_meta.deleteMany({
					where: {
						review_id: record.id,
					},
				});
			}
		} else {
			record = await prisma.review.create({
				data: {
					user_id: user.id,
					status: 'PENDING',
					verified_status:
						user.verified_status === 'ACTIVE' ? 'ACTIVE' : 'PENDING',
					weight,
					...(autoApprove ? { approved: true, approved_by: user.id } : {}),
					...body,
				},
			});
		}

		if (info) {
			const metaData = info.map(value => ({
				review_id: record.id,
				key: value.key,
				value: value.value,
			}));
			await prisma.review_meta.createMany({
				data: metaData,
			});
		}

		if (files) {
			const imagesData = files.map(file => ({
				review_id: record.id,
				file_type: file.mimetype,
				file_path: file.filename,
			}));
			await prisma.review_images.createMany({
				data: imagesData,
			});
		}

		this.updateReviewAggregation(record.business_id);
		// this.checkUserBadges(user);
		this.assignPoints(record);

		const updateRecord = await createOTP(user.id, 'review', record.id);

		record.OTP = updateRecord.OTP;

		return { record };
	}

	async assignPoints(review) {
		if (review.approved !== 1 || review.verified_status === 'PENDING') return;

		const points = await getAdminOption('review_points');
		const pointsLog = await prisma.points.findFirst({
			where: {
				source: 'review',
				user_id: review.user_id,
				reference_id: review.id,
			},
		});

		if (pointsLog && pointsLog.id) return;

		await prisma.points.create({
			data: {
				source: 'review',
				user_id: review.user_id,
				reference_id: review.id,
				in: points,
			},
		});
		const user = await prisma.user.findUnique({
			where: {
				id: review.user_id,
				deleted: false,
			},
		});
		if (user) this.checkUserBadges(user);
	}

	async resendReviewOTP() {
		const { user } = this.req;
		const { id } = this.req.params;

		const updateRecord = await createOTP(user.id, 'review', id);

		if (updateRecord.password) delete updateRecord.password;
		if (updateRecord.remember_token) delete updateRecord.remember_token;

		return { updateRecord };
	}

	async updateReview() {
		const { id } = this.req.params;
		const { body, user } = this.req;
		const { approved, status, ...updateinfo } = body;

		const reviewInfo = await prisma.review.findUnique({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
		});

		let newStatus = status ?? reviewInfo.status;

		if (
			approved &&
			user.role_id === 1 &&
			reviewInfo.status === 'PENDING_APPROVAL'
		) {
			newStatus = 'ACTIVE';
		} else if (!approved && user.role_id === 1 && approved !== undefined) {
			newStatus = 'PENDING_APPROVAL';
		}

		const updateRecord = await prisma.review.update({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			data: {
				status: newStatus,
				...updateinfo,
				...(approved !== undefined && user.role_id === 1
					? { approved, approved_by: user.id }
					: {}),
			},
		});

		this.updateReviewAggregation(updateRecord.business_id);
		this.assignPoints(updateRecord);
		// this.checkUserBadges(user);

		return updateRecord;
	}

	async updateManyReview() {
		const { body, user } = this.req;
		const { ids, approved, ...updatenfo } = body;

		await prisma.review.updateMany({
			where: {
				deleted: false,
				id: {
					in: ids,
				},
			},
			data: {
				...(approved !== undefined && user.role_id === 1
					? { approved, approved_by: user.id }
					: {}),
				...updatenfo,
			},
		});

		await prisma.review.updateMany({
			where: {
				deleted: false,
				approved: true,
				status: 'PENDING_APPROVAL',
				id: {
					in: ids,
				},
			},
			data: {
				status: 'ACTIVE',
			},
		});

		const records = await prisma.review.findMany({
			where: {
				id: {
					in: ids,
				},
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
						role_id: true,
						verified_status: true,
					},
				},
			},
		});

		records.map(review => {
			this.updateReviewAggregation(review.business_id);
			this.assignPoints(review);
			// this.checkUserBadges(review.user);
			return {};
		});

		return records;
	}

	async deleteReview() {
		const { id } = this.req.params;
		const { user } = this.req;

		const record = await prisma.review.update({
			where: {
				deleted: false,
				id: parseInt(id, 10),
			},
			data: {
				deleted: true,
			},
		});

		this.updateReviewAggregation(record.business_id);
		this.checkUserBadges(user);

		return null;
	}

	async deleteManyReview() {
		const { ids } = this.req.body;

		await prisma.review.updateMany({
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

	async verifyReview() {
		const { review, user } = this.req;

		const reviewInfo = await prisma.review.findUnique({
			where: {
				deleted: false,
				id: parseInt(review, 10),
			},
		});

		const updateRecord = await prisma.review.update({
			where: {
				deleted: false,
				id: parseInt(review, 10),
			},
			data: {
				status: reviewInfo.approved ? 'ACTIVE' : 'PENDING_APPROVAL',
			},
		});

		this.updateReviewAggregation(updateRecord.business_id);
		this.assignPoints(updateRecord);
		// this.checkUserBadges(user);

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				remember_token: null,
			},
		});

		return updateRecord;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async calculateReviewWeight(categoryId = false) {
		const { user } = this.req;
		let weight = 1;
		if (categoryId) {
			const category = await prisma.category.findUnique({
				where: {
					id: categoryId,
				},
			});
			weight =
				user.verified_status === 'ACTIVE'
					? category.weight
					: category.nv_weight;
		}
		if (user.verified_status !== 'ACTIVE') {
			const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
			const decayRate = 0.2;
			const recentReviews = await prisma.review.count({
				where: {
					user_id: user.id,
					created_at: { gte: oneHourAgo },
				},
			});
			weight = Math.max(weight - recentReviews * decayRate, 0.1);
		}
		return weight;
	}

	/* eslint-disable-next-line class-methods-use-this */
	async updateReviewAggregation(businessId) {
		// const averageRating = await prisma.review.aggregate({
		// 	where: {
		// 		business_id: businessId,
		// 		approved: true,
		// 		deleted: false,
		// 	},
		// 	_avg: {
		// 		rating: true,
		// 	},
		// });

		// const avgRating = averageRating._avg.rating;

		const result = await prisma.$queryRaw`
            SELECT 
                SUM(rating * weight) AS totalWeightedScore, 
                SUM(weight) AS totalWeight 
            FROM review
			WHERE 
				business_id = ${businessId} 
				AND approved = 1
				AND status = 'ACTIVE'
				AND deleted = 0
		`;

		const { totalWeightedScore, totalWeight } = result[0];

		const avgRating = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

		await prisma.business.update({
			where: {
				id: businessId,
			},
			data: {
				rating: parseFloat(avgRating.toFixed(2)),
			},
		});
	}

	/* eslint-disable-next-line class-methods-use-this */
	async checkUserBadges(user) {
		const userPoints = await prisma.points.aggregate({
			where: {
				user_id: user.id,
			},
			_sum: {
				in: true,
				out: true,
			},
		});

		const totalPoints = (userPoints._sum.in || 0) - (userPoints._sum.out || 0);

		const pointsBasedBadge = await prisma.badge.findFirst({
			where: {
				min_points: {
					lte: totalPoints,
				},
				max_points: {
					gte: totalPoints,
				},
				NOT: {
					badge_log: {
						some: {
							user_id: user.id,
						},
					},
				},
			},
			orderBy: {
				max_points: 'desc',
			},
		});

		if (pointsBasedBadge && pointsBasedBadge.id !== user.badge_id) {
			await prisma.user.update({
				where: { id: user.id },
				data: { badge_id: pointsBasedBadge.id },
			});
			await prisma.badge_log.create({
				data: {
					badge_id: pointsBasedBadge.id,
					user_id: user.id,
				},
			});
		}

		// const userReviewStats = await prisma.$queryRaw`
		// 	SELECT
		// 	COUNT(*) AS totalReviews,
		// 	SUM(CASE WHEN approved = 1 THEN 1 ELSE 0 END) AS approvedReviews
		// 	,SUM(CASE WHEN approved = 1 THEN weight ELSE 0 END) AS totalApprovedWeight
		// 	FROM review
		// 	WHERE user_id = ${user.id}
		// 			and deleted = 0
		// 			and verified_status='ACTIVE'
		// `;

		// const { totalReviews, approvedReviews, totalApprovedWeight } = userReviewStats[0] || { totalReviews: 0, approvedReviews: 0 };

		// // Calculate approval percentage
		// const approvalPercentage = (parseInt(approvedReviews, 10) / parseInt(totalReviews, 10)) * 100;

		// // const minApprovedReviews = user.verified_status === 'ACTIVE' ? Math.ceil(approvedReviews / 2) : approvedReviews;
		// const minApprovedReviews = totalApprovedWeight ?? approvedReviews;

		// const eligibleBadge = await prisma.badge.findFirst({
		// 	where: {
		// 		success_percentage: {
		// 			lte: (approvalPercentage > 0 ? approvalPercentage : 0),
		// 	  	},
		// 	  	success_count: {
		// 			lte: (minApprovedReviews > 0 ? minApprovedReviews : 0),
		// 	  	},
		// 		NOT: {
		// 			badge_log: {
		// 			  	some: {
		// 					user_id: user.id, // Ensure the badge is not logged for the user
		// 			  	},
		// 			},
		// 		},
		// 	},
		// 	orderBy: {
		// 		success_count: 'desc', // Fetch the latest badge based on creation time
		// 	},
		// });

		// if(eligibleBadge && eligibleBadge.id !== user.badge_id){
		// 	await prisma.user.update({
		// 		where: { id: user.id },
		// 		data: { badge_id: eligibleBadge.id },
		// 	});
		// 	await prisma.badge_log.create({
		// 		data: {
		// 			badge_id: eligibleBadge.id,
		// 			user_id: user.id
		// 		},
		// 	});
		// }
	}
}
