import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import {
	GET_CATEGORY_SUCCESS,
	CATEGORY_CREATED_SUCCESS,
	CATEGORY_UPDATED_SUCCESS,
	CATEGORY_DELETED_SUCCESS,
} from '../constants';
import { CategoryService } from '../services';
import { successResponse } from '../utils';

export const getAllCategory = asyncHandler(async (req, res) => {
	const categoryService = new CategoryService(req);
	const data = await categoryService.getAllCategory();

	return successResponse(res, HttpStatus.OK, GET_CATEGORY_SUCCESS, data);
});

export const getCategory = asyncHandler(async (req, res) => {
	const categoryService = new CategoryService(req);
	const data = await categoryService.getCategory();

	return successResponse(res, HttpStatus.OK, GET_CATEGORY_SUCCESS, data);
});

export const createCategory = asyncHandler(async (req, res) => {
	const categoryService = new CategoryService(req);
	const data = await categoryService.createCategory();

	return successResponse(res, HttpStatus.OK, CATEGORY_CREATED_SUCCESS, data);
});

export const updateCategory = asyncHandler(async (req, res) => {
	const categoryService = new CategoryService(req);
	const data = await categoryService.updateCategory();

	return successResponse(res, HttpStatus.OK, CATEGORY_UPDATED_SUCCESS, data);
});

export const deleteCategory = asyncHandler(async (req, res) => {
	const categoryService = new CategoryService(req);
	const data = await categoryService.deleteCategory();

	return successResponse(res, HttpStatus.OK, CATEGORY_DELETED_SUCCESS, data);
});

export const deleteManyCategory = asyncHandler(async (req, res) => {
	const categoryService = new CategoryService(req);
	const data = await categoryService.deleteManyCategory();

	return successResponse(res, HttpStatus.OK, CATEGORY_DELETED_SUCCESS, data);
});
