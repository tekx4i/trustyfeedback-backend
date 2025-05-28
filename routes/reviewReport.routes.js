import { Router } from 'express';

import {
	getAllReviewReports,
	getReviewReport,
	createReviewReport,
	updateReviewReport,
} from '../controllers';
import { validate, isAuth, isAdmin } from '../middlewares';
import {
	getReviewReportSchema,
	addReviewReportSchema,
	ReviewReportIdSchema,
	updateReviewReportSchema,
} from '../validations';

const router = Router();

router.get('/', isAuth, validate(getReviewReportSchema), getAllReviewReports);
router.get('/:id', isAuth, validate(ReviewReportIdSchema), getReviewReport);
router.post('/', isAuth, validate(addReviewReportSchema), createReviewReport);
router.put(
	'/:id',
	isAdmin,
	validate(updateReviewReportSchema),
	updateReviewReport,
);

export const ReviewReportRoutes = router;
