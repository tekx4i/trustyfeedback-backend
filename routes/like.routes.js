import { Router } from 'express';

import {
	getAllLikes,
	getLike,
	createLike,
	deleteLike,
	deleteByData,
} from '../controllers';
import { validate, isAuth } from '../middlewares';
import { getLikeSchema, addLikeSchema, LikeIdSchema } from '../validations';

const router = Router();

router.get('/', isAuth, validate(getLikeSchema), getAllLikes);
router.get('/:id', isAuth, validate(LikeIdSchema), getLike);
router.post('/', isAuth, validate(addLikeSchema), createLike);
router.delete('/:id', isAuth, validate(LikeIdSchema), deleteLike);
router.delete('/', isAuth, validate(addLikeSchema), deleteByData);

export const LikeRoutes = router;
