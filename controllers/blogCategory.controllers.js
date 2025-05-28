import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import {
	GET_BLOG_CATEGORY_SUCCESS,
	BLOG_CATEGORY_CREATED_SUCCESS,
	BLOG_CATEGORY_UPDATED_SUCCESS,
	BLOG_CATEGORY_DELETED_SUCCESS,
} from '../constants';
import { BlogCategoryService } from '../services';
import { successResponse } from '../utils';

export const getAllBlogCategorys = asyncHandler(async (req, res) => {
	const blogCategoryService = new BlogCategoryService(req);
	const data = await blogCategoryService.getAllBlogCategorys();

	return successResponse(res, HttpStatus.OK, GET_BLOG_CATEGORY_SUCCESS, data);
});

export const getBlogCategory = asyncHandler(async (req, res) => {
	const blogCategoryService = new BlogCategoryService(req);
	const data = await blogCategoryService.getBlogCategory();

	return successResponse(res, HttpStatus.OK, GET_BLOG_CATEGORY_SUCCESS, data);
});

export const createBlogCategory = asyncHandler(async (req, res) => {
	const blogCategoryService = new BlogCategoryService(req);
	const data = await blogCategoryService.createBlogCategory();

	return successResponse(
		res,
		HttpStatus.OK,
		BLOG_CATEGORY_CREATED_SUCCESS,
		data,
	);
});

export const updateBlogCategory = asyncHandler(async (req, res) => {
	const blogCategoryService = new BlogCategoryService(req);
	const data = await blogCategoryService.updateBlogCategory();

	return successResponse(
		res,
		HttpStatus.OK,
		BLOG_CATEGORY_UPDATED_SUCCESS,
		data,
	);
});

export const deleteBlogCategory = asyncHandler(async (req, res) => {
	const blogCategoryService = new BlogCategoryService(req);
	const data = await blogCategoryService.deleteBlogCategory();

	return successResponse(
		res,
		HttpStatus.OK,
		BLOG_CATEGORY_DELETED_SUCCESS,
		data,
	);
});

export const deleteManyBlogCategory = asyncHandler(async (req, res) => {
	const blogCategoryService = new BlogCategoryService(req);
	const data = await blogCategoryService.deleteManyBlogCategory();

	return successResponse(
		res,
		HttpStatus.OK,
		BLOG_CATEGORY_DELETED_SUCCESS,
		data,
	);
});
