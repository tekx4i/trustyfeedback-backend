import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import {
	GET_LIKE_SUCCESS,
	LIKE_CREATED_SUCCESS,
	LIKE_DELETED_SUCCESS,
} from '../constants';
import { LikeService } from '../services';
import { successResponse } from '../utils';

export const getAllLikes = asyncHandler(async (req, res) => {
	const likeService = new LikeService(req);
	const data = await likeService.getAllLikes();

	return successResponse(res, HttpStatus.OK, GET_LIKE_SUCCESS, data);
});

export const getLike = asyncHandler(async (req, res) => {
	const likeService = new LikeService(req);
	const data = await likeService.getLike();

	return successResponse(res, HttpStatus.OK, GET_LIKE_SUCCESS, data);
});

export const createLike = asyncHandler(async (req, res) => {
	const likeService = new LikeService(req);
	const data = await likeService.createLike();

	return successResponse(res, HttpStatus.OK, LIKE_CREATED_SUCCESS, data);
});

export const deleteLike = asyncHandler(async (req, res) => {
	const likeService = new LikeService(req);
	const data = await likeService.deleteLike();

	return successResponse(res, HttpStatus.OK, LIKE_DELETED_SUCCESS, data);
});

export const deleteByData = asyncHandler(async (req, res) => {
	const likeService = new LikeService(req);
	const data = await likeService.deleteByData();

	return successResponse(res, HttpStatus.OK, LIKE_DELETED_SUCCESS, data);
});
