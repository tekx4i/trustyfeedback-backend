import { Router } from 'express';

import {
	getStory,
	createStory,
	updateStory,
	deleteStory,
	getAllStories,
	deleteManyStory,
} from '../controllers';
import { validate, isAuth, optionalAuth, upload } from '../middlewares';
import {
	getStorySchema,
	addStorySchema,
	StoryIdSchema,
	updateStorySchema,
	deleteStoriesSchema,
} from '../validations';

const router = Router();

router.get('/', optionalAuth, validate(getStorySchema), getAllStories);
router.get('/:id', optionalAuth, validate(StoryIdSchema), getStory);
router.post(
	'/',
	isAuth,
	upload.single('imageUrl'),
	validate(addStorySchema),
	createStory,
);
router.put(
	'/:id',
	isAuth,
	upload.single('imageUrl'),
	validate(updateStorySchema),
	updateStory,
);
router.delete('/:id', isAuth, validate(StoryIdSchema), deleteStory);
router.delete('/', isAuth, validate(deleteStoriesSchema), deleteManyStory);

export const StoryRoutes = router;
