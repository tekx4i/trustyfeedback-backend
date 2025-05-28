import { Router } from 'express';

import {
	getUser,
	createUser,
	updateUser,
	deleteUser,
	adminStats,
	getAllUsers,
	updateManyUser,
	deleteManyUser,
	getAllUserPackages,
} from '../controllers';
import { validate, isAuth, isAdmin, upload } from '../middlewares';
import {
	userIdSchema,
	getUsersSchema,
	registerSchema,
	updateUserSchema,
	getPackagesSchema,
	deleteUsersSchema,
	updateProfileSchema,
	updateManyUserSchema,
} from '../validations';

const router = Router();

router.get('/', isAuth, validate(getUsersSchema), getAllUsers);
router.get('/stats', isAdmin, adminStats);
router.get(
	'/packages',
	isAuth,
	validate(getPackagesSchema),
	getAllUserPackages,
);
router.get('/:id', isAuth, validate(userIdSchema), getUser);
router.post('/', isAdmin, validate(registerSchema), createUser);
router.put(
	'/me',
	isAuth,
	upload.single('image'),
	validate(updateProfileSchema),
	updateUser,
);
router.put('/many', isAdmin, validate(updateManyUserSchema), updateManyUser);

router.put(
	'/:id',
	isAdmin,
	upload.single('image'),
	validate(updateUserSchema),
	updateUser,
);
router.delete('/:id', isAdmin, validate(userIdSchema), deleteUser);
router.delete('/', isAdmin, validate(deleteUsersSchema), deleteManyUser);

export const UserRoutes = router;
