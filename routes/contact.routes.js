import { Router } from 'express';

import {
	getAllContacts,
	getContact,
	createContact,
	updateContact,
	deleteContact,
	deleteManyContact,
} from '../controllers';
import { validate, isAuth, optionalAuth } from '../middlewares';
import {
	getContactSchema,
	addContactSchema,
	ContactIdSchema,
	updateContactSchema,
	deleteContactsSchema,
} from '../validations';

const router = Router();

router.get('/', isAuth, validate(getContactSchema), getAllContacts);
router.get('/:id', isAuth, validate(ContactIdSchema), getContact);
router.post('/', optionalAuth, validate(addContactSchema), createContact);
router.put('/:id', isAuth, validate(updateContactSchema), updateContact);
router.delete('/:id', isAuth, validate(ContactIdSchema), deleteContact);
router.delete('/', isAuth, validate(deleteContactsSchema), deleteManyContact);

export const ContactRoutes = router;
