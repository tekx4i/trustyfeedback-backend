import { Router } from 'express';

import {
	getAllBlogs,
	getBlog,
	createBlog,
	updateBlog,
	deleteBlog,
	deleteManyBlog,
} from '../controllers';
import { validate, isAdmin, optionalAuth, upload } from '../middlewares';
import {
	getBlogSchema,
	addBlogSchema,
	BlogIdSchema,
	updateBlogSchema,
	deleteBlogsSchema,
} from '../validations';

const router = Router();

router.get('/', optionalAuth, validate(getBlogSchema), getAllBlogs);
router.get('/:id', optionalAuth, validate(BlogIdSchema), getBlog);
router.post(
	'/',
	isAdmin,
	upload.single('file'),
	validate(addBlogSchema),
	createBlog,
);
router.put(
	'/:id',
	isAdmin,
	upload.single('file'),
	validate(updateBlogSchema),
	updateBlog,
);
router.delete('/:id', isAdmin, validate(BlogIdSchema), deleteBlog);
router.delete('/', isAdmin, validate(deleteBlogsSchema), deleteManyBlog);

export const BlogRoutes = router;
