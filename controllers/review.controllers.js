import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import {
	OTP_SEND_SUCCESS,
	GET_REVIEW_SUCCESS,
	REVIEW_CREATED_SUCCESS,
	REVIEW_UPDATED_SUCCESS,
	REVIEW_DELETED_SUCCESS,
	REVIEW_VERIFIED_SUCCESS,
	REVIEW_FAVORITED_SUCCESS,
	REVIEW_FAVORITED_DELETED,
} from '../constants';
import { ReviewService } from '../services';
import { successResponse } from '../utils';

export const getAllReviews = asyncHandler(async (req, res) => {
	const reviewService = new ReviewService(req);
	const data = await reviewService.getAllReviews();

	return successResponse(res, HttpStatus.OK, GET_REVIEW_SUCCESS, data);
});

export const getReview = asyncHandler(async (req, res) => {
	const reviewService = new ReviewService(req);
	const data = await reviewService.getReview();

	return successResponse(res, HttpStatus.OK, GET_REVIEW_SUCCESS, data);
});

export const setReviewsFavorite = asyncHandler(async (req, res) => {
	const reviewService = new ReviewService(req);
	const data = await reviewService.setReviewsFavorite();

	return successResponse(res, HttpStatus.OK, REVIEW_FAVORITED_SUCCESS, data);
});

export const removeFavoriteReview = asyncHandler(async (req, res) => {
	const reviewService = new ReviewService(req);
	const data = await reviewService.removeFavoriteReviews();

	return successResponse(res, HttpStatus.OK, REVIEW_FAVORITED_DELETED, data);
});

export const createReview = asyncHandler(async (req, res) => {
	const reviewService = new ReviewService(req);
	const data = await reviewService.createReview();

	return successResponse(res, HttpStatus.OK, REVIEW_CREATED_SUCCESS, data);
});

export const resendReviewOTP = asyncHandler(async (req, res) => {
	const reviewService = new ReviewService(req);
	const data = await reviewService.resendReviewOTP();

	return successResponse(res, HttpStatus.OK, OTP_SEND_SUCCESS, data);
});

export const verifyReview = asyncHandler(async (req, res) => {
	const reviewService = new ReviewService(req);
	const data = await reviewService.verifyReview();

	return successResponse(res, HttpStatus.OK, REVIEW_VERIFIED_SUCCESS, data);
});

export const updateReview = asyncHandler(async (req, res) => {
	const reviewService = new ReviewService(req);
	const data = await reviewService.updateReview();

	return successResponse(res, HttpStatus.OK, REVIEW_UPDATED_SUCCESS, data);
});

export const updateManyReview = asyncHandler(async (req, res) => {
	const reviewService = new ReviewService(req);
	const data = await reviewService.updateManyReview();

	return successResponse(res, HttpStatus.OK, REVIEW_UPDATED_SUCCESS, data);
});

export const deleteReview = asyncHandler(async (req, res) => {
	const reviewService = new ReviewService(req);
	const data = await reviewService.deleteReview();

	return successResponse(res, HttpStatus.OK, REVIEW_DELETED_SUCCESS, data);
});

export const deleteManyReview = asyncHandler(async (req, res) => {
	const reviewService = new ReviewService(req);
	const data = await reviewService.deleteManyReview();

	return successResponse(res, HttpStatus.OK, REVIEW_DELETED_SUCCESS, data);
});
