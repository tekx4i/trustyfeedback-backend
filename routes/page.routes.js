import { Router } from 'express';

import {
	getAllPages,
	getPage,
	getPageByUrl,
	createPage,
	updatePage,
	deletePage,
	deleteManyPage,
} from '../controllers';
import { validate, isAdmin, upload } from '../middlewares';
import {
	getPageSchema,
	addPageSchema,
	PageIdSchema,
	GetPageByUrlSchema,
	updatePageSchema,
	deletePagesSchema,
} from '../validations';

const router = Router();

router.get('/', validate(getPageSchema), getAllPages);
router.get('/single', validate(GetPageByUrlSchema), getPageByUrl);
router.get('/:id', validate(PageIdSchema), getPage);
router.post(
	'/',
	isAdmin,
	upload.single('image'),
	validate(addPageSchema),
	createPage,
);
router.put(
	'/:id',
	isAdmin,
	upload.single('image'),
	validate(updatePageSchema),
	updatePage,
);
router.delete('/:id', isAdmin, validate(PageIdSchema), deletePage);
router.delete('/', isAdmin, validate(deletePagesSchema), deleteManyPage);

export const PageRoutes = router;
