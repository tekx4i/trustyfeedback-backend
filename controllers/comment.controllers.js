import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import {
	GET_COMMENT_SUCCESS,
	COMMENT_CREATED_SUCCESS,
	COMMENT_UPDATED_SUCCESS,
	COMMENT_DELETED_SUCCESS,
} from '../constants';
import { CommentService } from '../services';
import { successResponse } from '../utils';

export const getAllComments = asyncHandler(async (req, res) => {
	const commentService = new CommentService(req);
	const data = await commentService.getAllComments();

	return successResponse(res, HttpStatus.OK, GET_COMMENT_SUCCESS, data);
});

export const getComment = asyncHandler(async (req, res) => {
	const commentService = new CommentService(req);
	const data = await commentService.getComment();

	return successResponse(res, HttpStatus.OK, GET_COMMENT_SUCCESS, data);
});

export const createComment = asyncHandler(async (req, res) => {
	const commentService = new CommentService(req);
	const data = await commentService.createComment();

	return successResponse(res, HttpStatus.OK, COMMENT_CREATED_SUCCESS, data);
});

export const updateComment = asyncHandler(async (req, res) => {
	const commentService = new CommentService(req);
	const data = await commentService.updateComment();

	return successResponse(res, HttpStatus.OK, COMMENT_UPDATED_SUCCESS, data);
});

export const deleteComment = asyncHandler(async (req, res) => {
	const commentService = new CommentService(req);
	const data = await commentService.deleteComment();

	return successResponse(res, HttpStatus.OK, COMMENT_DELETED_SUCCESS, data);
});

export const deleteManyComment = asyncHandler(async (req, res) => {
	const commentService = new CommentService(req);
	const data = await commentService.deleteManyComment();

	return successResponse(res, HttpStatus.OK, COMMENT_DELETED_SUCCESS, data);
});
