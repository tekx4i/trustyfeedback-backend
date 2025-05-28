import { Router } from 'express';

import {
	getAllBusinesss,
	getBusiness,
	// createBusiness,
	updateBusiness,
	deleteBusiness,
	getBusinessInfo,
	deleteManyBusiness,
	setBusinessFavorite,
	removeFavoriteBusiness,
} from '../controllers';
import {
	validate,
	isAuth,
	isAdmin,
	optionalAuth,
	upload,
} from '../middlewares';
import {
	getBusinessSchema,
	// addBusinessSchema,
	BusinessIdSchema,
	updateBusinessSchema,
	deleteBusinesssSchema,
} from '../validations';

const router = Router();

router.get('/', optionalAuth, validate(getBusinessSchema), getAllBusinesss);
router.get('/:id', optionalAuth, validate(BusinessIdSchema), getBusiness);
router.get('/info/:key', getBusinessInfo);
router.post(
	'/favorite/:id',
	isAuth,
	validate(BusinessIdSchema),
	setBusinessFavorite,
);
router.delete(
	'/favorite/:id',
	isAuth,
	validate(BusinessIdSchema),
	removeFavoriteBusiness,
);
// router.post('/', isAuth, validate(addBusinessSchema), createBusiness);
router.put(
	'/:id',
	isAuth,
	upload.single('image'),
	validate(updateBusinessSchema),
	updateBusiness,
);
router.delete('/:id', isAdmin, validate(BusinessIdSchema), deleteBusiness);
router.delete(
	'/',
	isAdmin,
	validate(deleteBusinesssSchema),
	deleteManyBusiness,
);

export const BusinessRoutes = router;
