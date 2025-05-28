import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import {
	GET_REVIEW_REPORT_SUCCESS,
	REVIEW_REPORT_CREATED_SUCCESS,
	REVIEW_REPORT_UPDATED_SUCCESS,
} from '../constants';
import { ReviewReportService } from '../services';
import { successResponse } from '../utils';

export const getAllReviewReports = asyncHandler(async (req, res) => {
	const reviewReportService = new ReviewReportService(req);
	const data = await reviewReportService.getAllReviewReports();

	return successResponse(res, HttpStatus.OK, GET_REVIEW_REPORT_SUCCESS, data);
});

export const getReviewReport = asyncHandler(async (req, res) => {
	const reviewReportService = new ReviewReportService(req);
	const data = await reviewReportService.getReviewReport();

	return successResponse(res, HttpStatus.OK, GET_REVIEW_REPORT_SUCCESS, data);
});

export const createReviewReport = asyncHandler(async (req, res) => {
	const reviewReportService = new ReviewReportService(req);
	const data = await reviewReportService.createReviewReport();

	return successResponse(
		res,
		HttpStatus.OK,
		REVIEW_REPORT_CREATED_SUCCESS,
		data,
	);
});

export const updateReviewReport = asyncHandler(async (req, res) => {
	const reviewReportService = new ReviewReportService(req);
	const data = await reviewReportService.updateReviewReport();

	return successResponse(
		res,
		HttpStatus.OK,
		REVIEW_REPORT_UPDATED_SUCCESS,
		data,
	);
});
