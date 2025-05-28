import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import {
	GET_MENU_SUCCESS,
	MENU_CREATED_SUCCESS,
	MENU_UPDATED_SUCCESS,
	MENU_DELETED_SUCCESS,
} from '../constants';
import { MenuService } from '../services';
import { successResponse } from '../utils';

export const getAllMenus = asyncHandler(async (req, res) => {
	const menuService = new MenuService(req);
	const data = await menuService.getAllMenus();

	return successResponse(res, HttpStatus.OK, GET_MENU_SUCCESS, data);
});

export const getMenu = asyncHandler(async (req, res) => {
	const menuService = new MenuService(req);
	const data = await menuService.getMenu();

	return successResponse(res, HttpStatus.OK, GET_MENU_SUCCESS, data);
});

export const getMenuByLocation = asyncHandler(async (req, res) => {
	const menuService = new MenuService(req);
	const data = await menuService.getMenuByLocation();

	return successResponse(res, HttpStatus.OK, GET_MENU_SUCCESS, data);
});

export const createMenu = asyncHandler(async (req, res) => {
	const menuService = new MenuService(req);
	const data = await menuService.createMenu();

	return successResponse(res, HttpStatus.OK, MENU_CREATED_SUCCESS, data);
});

export const updateMenu = asyncHandler(async (req, res) => {
	const menuService = new MenuService(req);
	const data = await menuService.updateMenu();

	return successResponse(res, HttpStatus.OK, MENU_UPDATED_SUCCESS, data);
});

export const deleteMenu = asyncHandler(async (req, res) => {
	const menuService = new MenuService(req);
	const data = await menuService.deleteMenu();

	return successResponse(res, HttpStatus.OK, MENU_DELETED_SUCCESS, data);
});

export const deleteManyMenu = asyncHandler(async (req, res) => {
	const menuService = new MenuService(req);
	const data = await menuService.deleteManyMenu();

	return successResponse(res, HttpStatus.OK, MENU_DELETED_SUCCESS, data);
});
