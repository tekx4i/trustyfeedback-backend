import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import {
	GET_BLOG_SUCCESS,
	BLOG_CREATED_SUCCESS,
	BLOG_UPDATED_SUCCESS,
	BLOG_DELETED_SUCCESS,
} from '../constants';
import { BlogService } from '../services';
import { successResponse } from '../utils';

export const getAllBlogs = asyncHandler(async (req, res) => {
	const blogService = new BlogService(req);
	const data = await blogService.getAllBlogs();

	return successResponse(res, HttpStatus.OK, GET_BLOG_SUCCESS, data);
});

export const getBlog = asyncHandler(async (req, res) => {
	const blogService = new BlogService(req);
	const data = await blogService.getBlog();

	return successResponse(res, HttpStatus.OK, GET_BLOG_SUCCESS, data);
});

export const createBlog = asyncHandler(async (req, res) => {
	const blogService = new BlogService(req);
	const data = await blogService.createBlog();

	return successResponse(res, HttpStatus.OK, BLOG_CREATED_SUCCESS, data);
});

export const updateBlog = asyncHandler(async (req, res) => {
	const blogService = new BlogService(req);
	const data = await blogService.updateBlog();

	return successResponse(res, HttpStatus.OK, BLOG_UPDATED_SUCCESS, data);
});

export const deleteBlog = asyncHandler(async (req, res) => {
	const blogService = new BlogService(req);
	const data = await blogService.deleteBlog();

	return successResponse(res, HttpStatus.OK, BLOG_DELETED_SUCCESS, data);
});

export const deleteManyBlog = asyncHandler(async (req, res) => {
	const blogService = new BlogService(req);
	const data = await blogService.deleteManyBlog();

	return successResponse(res, HttpStatus.OK, BLOG_DELETED_SUCCESS, data);
});
