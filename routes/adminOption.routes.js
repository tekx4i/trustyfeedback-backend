import { Router } from 'express';

import {
	getAllAdminOptions,
	getAdminOption,
	createAdminOption,
	updateAdminOption,
	deleteAdminOption,
	deleteManyAdminOption,
} from '../controllers';
import { validate, isAuth, isAdmin } from '../middlewares';
import {
	getAdminOptionSchema,
	addAdminOptionSchema,
	AdminOptionIdSchema,
	updateAdminOptionSchema,
	deleteAdminOptionsSchema,
} from '../validations';

const router = Router();

router.get('/', isAuth, validate(getAdminOptionSchema), getAllAdminOptions);
router.get('/:id', isAuth, validate(AdminOptionIdSchema), getAdminOption);
router.post('/', isAdmin, validate(addAdminOptionSchema), createAdminOption);
router.put(
	'/:id',
	isAdmin,
	validate(updateAdminOptionSchema),
	updateAdminOption,
);
router.delete(
	'/:id',
	isAdmin,
	validate(AdminOptionIdSchema),
	deleteAdminOption,
);
router.delete(
	'/',
	isAdmin,
	validate(deleteAdminOptionsSchema),
	deleteManyAdminOption,
);

export const AdminOptionRoutes = router;
