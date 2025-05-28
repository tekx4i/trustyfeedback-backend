import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import {
	GET_ADMIN_OPTION_SUCCESS,
	ADMIN_OPTION_CREATED_SUCCESS,
	ADMIN_OPTION_UPDATED_SUCCESS,
	ADMIN_OPTION_DELETED_SUCCESS,
} from '../constants';
import { AdminOptionService } from '../services';
import { successResponse } from '../utils';

export const getAllAdminOptions = asyncHandler(async (req, res) => {
	const adminOptionService = new AdminOptionService(req);
	const data = await adminOptionService.getAllAdminOptions();

	return successResponse(res, HttpStatus.OK, GET_ADMIN_OPTION_SUCCESS, data);
});

export const getAdminOption = asyncHandler(async (req, res) => {
	const adminOptionService = new AdminOptionService(req);
	const data = await adminOptionService.getAdminOption();

	return successResponse(res, HttpStatus.OK, GET_ADMIN_OPTION_SUCCESS, data);
});

export const createAdminOption = asyncHandler(async (req, res) => {
	const adminOptionService = new AdminOptionService(req);
	const data = await adminOptionService.createAdminOption();

	return successResponse(
		res,
		HttpStatus.OK,
		ADMIN_OPTION_CREATED_SUCCESS,
		data,
	);
});

export const updateAdminOption = asyncHandler(async (req, res) => {
	const adminOptionService = new AdminOptionService(req);
	const data = await adminOptionService.updateAdminOption();

	return successResponse(
		res,
		HttpStatus.OK,
		ADMIN_OPTION_UPDATED_SUCCESS,
		data,
	);
});

export const deleteAdminOption = asyncHandler(async (req, res) => {
	const adminOptionService = new AdminOptionService(req);
	const data = await adminOptionService.deleteAdminOption();

	return successResponse(
		res,
		HttpStatus.OK,
		ADMIN_OPTION_DELETED_SUCCESS,
		data,
	);
});

export const deleteManyAdminOption = asyncHandler(async (req, res) => {
	const adminOptionService = new AdminOptionService(req);
	const data = await adminOptionService.deleteManyAdminOption();

	return successResponse(
		res,
		HttpStatus.OK,
		ADMIN_OPTION_DELETED_SUCCESS,
		data,
	);
});
