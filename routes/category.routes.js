import { Router } from 'express';

import {
	getAllCategory,
	getCategory,
	createCategory,
	updateCategory,
	deleteCategory,
	deleteManyCategory,
} from '../controllers';
import { validate, isAdmin, upload } from '../middlewares';
import {
	getCategorySchema,
	addCategorySchema,
	CategoryIdSchema,
	updateCategorySchema,
	deleteCategorySchema,
} from '../validations';

const router = Router();

router.get('/', validate(getCategorySchema), getAllCategory);
router.get('/:id', validate(CategoryIdSchema), getCategory);
router.post(
	'/',
	isAdmin,
	upload.single('image'),
	validate(addCategorySchema),
	createCategory,
);
router.put(
	'/:id',
	isAdmin,
	upload.single('image'),
	validate(updateCategorySchema),
	updateCategory,
);
router.delete('/:id', isAdmin, validate(CategoryIdSchema), deleteCategory);
router.delete('/', isAdmin, validate(deleteCategorySchema), deleteManyCategory);

export const CategoryRoutes = router;
