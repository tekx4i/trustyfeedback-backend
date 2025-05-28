import { Router } from 'express';

import {
	getAllPayments,
	getPayment,
	updatePayment,
	deletePayment,
	confirmPayment,
	deleteManyPayment,
	createPaymentIntent,
} from '../controllers';
import { validate, isAuth, isAdmin } from '../middlewares';
import {
	PaymentIdSchema,
	getPaymentSchema,
	createIntentSchema,
	updatePaymentSchema,
	confirmPaymentSchema,
	deletePaymentsSchema,
} from '../validations';

const router = Router();

router.get('/', isAuth, validate(getPaymentSchema), getAllPayments);
router.get('/:id', isAuth, validate(PaymentIdSchema), getPayment);
router.post(
	'/create-intent',
	isAuth,
	validate(createIntentSchema),
	createPaymentIntent,
);
router.post('/confirm', isAuth, validate(confirmPaymentSchema), confirmPayment);
// router.post('/', isAuth, validate(addPaymentSchema), createPayment);
router.put('/:id', isAdmin, validate(updatePaymentSchema), updatePayment);
router.delete('/:id', isAdmin, validate(PaymentIdSchema), deletePayment);
router.delete('/', isAdmin, validate(deletePaymentsSchema), deleteManyPayment);

export const PaymentRoutes = router;
