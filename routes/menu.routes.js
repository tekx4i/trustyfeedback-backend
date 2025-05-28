import { Router } from 'express';

import {
	getAllMenus,
	getMenu,
	createMenu,
	updateMenu,
	deleteMenu,
	deleteManyMenu,
	getMenuByLocation,
} from '../controllers';
import { validate, isAdmin } from '../middlewares';
import {
	getMenuSchema,
	addMenuSchema,
	MenuIdSchema,
	updateMenuSchema,
	deleteMenusSchema,
} from '../validations';

const router = Router();

router.get('/', validate(getMenuSchema), getAllMenus);
router.get('/location/:location', getMenuByLocation);
router.get('/:id', validate(MenuIdSchema), getMenu);
router.post('/', isAdmin, validate(addMenuSchema), createMenu);
router.put('/:id', isAdmin, validate(updateMenuSchema), updateMenu);
router.delete('/:id', isAdmin, validate(MenuIdSchema), deleteMenu);
router.delete('/', isAdmin, validate(deleteMenusSchema), deleteManyMenu);

export const MenuRoutes = router;
