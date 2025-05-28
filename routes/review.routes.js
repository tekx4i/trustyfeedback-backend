import { Router } from 'express';

import {
	getReview,
	getAllReviews,
	createReview,
	updateReview,
	deleteReview,
	verifyReview,
	resendReviewOTP,
	updateManyReview,
	deleteManyReview,
	setReviewsFavorite,
	removeFavoriteReview,
} from '../controllers';
import {
	isAuth,
	upload,
	validate,
	verifyOTP,
	optionalAuth,
} from '../middlewares';
import {
	ReviewIdSchema,
	getReviewSchema,
	addReviewSchema,
	verifyReviewSchema,
	updateReviewSchema,
	deleteReviewsSchema,
	updateManyReviewSchema,
} from '../validations';

const router = Router();

router.get('/', optionalAuth, validate(getReviewSchema), getAllReviews);
router.get(
	'/favorite/:id',
	isAuth,
	validate(ReviewIdSchema),
	setReviewsFavorite,
);
router.delete(
	'/favorite/:id',
	isAuth,
	validate(ReviewIdSchema),
	removeFavoriteReview,
);

router.post(
	'/resendOTP/:id',
	isAuth,
	validate(ReviewIdSchema),
	resendReviewOTP,
);

router.get('/:id', optionalAuth, validate(ReviewIdSchema), getReview);
router.post(
	'/verify',
	isAuth,
	validate(verifyReviewSchema),
	verifyOTP,
	verifyReview,
);
router.post(
	'/',
	isAuth,
	upload.array('images', 10),
	validate(addReviewSchema),
	createReview,
);
router.put('/:id', isAuth, validate(updateReviewSchema), updateReview);
router.put('/', isAuth, validate(updateManyReviewSchema), updateManyReview);
router.delete('/:id', isAuth, validate(ReviewIdSchema), deleteReview);
router.delete('/', isAuth, validate(deleteReviewsSchema), deleteManyReview);

export const ReviewRoutes = router;
