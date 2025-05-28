import { Router } from 'express';

import {
	getAllBadges,
	getBadge,
	createBadge,
	updateBadge,
	deleteBadge,
	deleteManyBadge,
} from '../controllers';
import { validate, isAuth, isAdmin, upload } from '../middlewares';
import {
	getBadgeSchema,
	addBadgeSchema,
	BadgeIdSchema,
	updateBadgeSchema,
	deleteBadgesSchema,
} from '../validations';

const router = Router();

router.get('/', isAuth, validate(getBadgeSchema), getAllBadges);
router.get('/:id', isAuth, validate(BadgeIdSchema), getBadge);
router.post(
	'/',
	isAdmin,
	upload.single('file'),
	validate(addBadgeSchema),
	createBadge,
);
router.put(
	'/:id',
	isAdmin,
	upload.single('file'),
	validate(updateBadgeSchema),
	updateBadge,
);
router.delete('/:id', isAdmin, validate(BadgeIdSchema), deleteBadge);
router.delete('/', isAdmin, validate(deleteBadgesSchema), deleteManyBadge);

export const BadgeRoutes = router;
