import { Router } from 'express';

import {
	getAllComments,
	getComment,
	createComment,
	updateComment,
	deleteComment,
	deleteManyComment,
} from '../controllers';
import { validate, isAuth, isAdmin, optionalAuth } from '../middlewares';
import {
	getCommentSchema,
	addCommentSchema,
	CommentIdSchema,
	updateCommentSchema,
	deleteCommentsSchema,
} from '../validations';

const router = Router();

router.get('/', optionalAuth, validate(getCommentSchema), getAllComments);
router.get('/:id', optionalAuth, validate(CommentIdSchema), getComment);
router.post('/', isAuth, validate(addCommentSchema), createComment);
router.put('/:id', isAuth, validate(updateCommentSchema), updateComment);
router.delete('/:id', isAuth, validate(CommentIdSchema), deleteComment);
router.delete('/', isAdmin, validate(deleteCommentsSchema), deleteManyComment);

export const CommentRoutes = router;
