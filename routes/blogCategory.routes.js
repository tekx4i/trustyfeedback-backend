import { Router } from 'express';

import {
	getAllBlogCategorys,
	getBlogCategory,
	createBlogCategory,
	updateBlogCategory,
	deleteBlogCategory,
	deleteManyBlogCategory,
} from '../controllers';
import { validate, upload, isAdmin } from '../middlewares';
import {
	getBlogCategorySchema,
	addBlogCategorySchema,
	BlogCategoryIdSchema,
	updateBlogCategorySchema,
	deleteBlogCategorysSchema,
} from '../validations';

const router = Router();

router.get('/', validate(getBlogCategorySchema), getAllBlogCategorys);
router.get('/:id', validate(BlogCategoryIdSchema), getBlogCategory);
router.post(
	'/',
	isAdmin,
	upload.single('file'),
	validate(addBlogCategorySchema),
	createBlogCategory,
);
router.put(
	'/:id',
	isAdmin,
	upload.single('file'),
	validate(updateBlogCategorySchema),
	updateBlogCategory,
);
router.delete(
	'/:id',
	isAdmin,
	validate(BlogCategoryIdSchema),
	deleteBlogCategory,
);
router.delete(
	'/',
	isAdmin,
	validate(deleteBlogCategorysSchema),
	deleteManyBlogCategory,
);

export const BlogCategoryRoutes = router;
