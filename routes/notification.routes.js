import { Router } from 'express';

import {
	getAllNotifications,
	getNotification,
	updateNotification,
	deleteNotification,
	readAllNotification,
	deleteManyNotification,
} from '../controllers';
import { validate, isAuth, isAdmin } from '../middlewares';
import {
	getNotificationSchema,
	NotificationIdSchema,
	updateNotificationSchema,
	deleteNotificationsSchema,
} from '../validations';

const router = Router();

router.get('/', isAuth, validate(getNotificationSchema), getAllNotifications);
router.get('/:id', isAuth, validate(NotificationIdSchema), getNotification);
router.put('/readall', isAuth, readAllNotification);
router.put(
	'/:id',
	isAuth,
	validate(updateNotificationSchema),
	updateNotification,
);
router.delete(
	'/:id',
	isAdmin,
	validate(NotificationIdSchema),
	deleteNotification,
);
router.delete(
	'/',
	isAdmin,
	validate(deleteNotificationsSchema),
	deleteManyNotification,
);

export const NotificationRoutes = router;
