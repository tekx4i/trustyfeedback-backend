import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import {
	GET_BUSINESS_SUCCESS,
	BUSINESS_CREATED_SUCCESS,
	BUSINESS_UPDATED_SUCCESS,
	BUSINESS_DELETED_SUCCESS,
	BUSINESS_FAVORITED_SUCCESS,
	BUSINESS_FAVORITED_DELETED,
} from '../constants';
import { BusinessService } from '../services';
import { successResponse } from '../utils';

export const getAllBusinesss = asyncHandler(async (req, res) => {
	const businessService = new BusinessService(req);
	const data = await businessService.getAllBusinesss();

	return successResponse(res, HttpStatus.OK, GET_BUSINESS_SUCCESS, data);
});

export const getBusiness = asyncHandler(async (req, res) => {
	const businessService = new BusinessService(req);
	const data = await businessService.getBusiness();

	return successResponse(res, HttpStatus.OK, GET_BUSINESS_SUCCESS, data);
});

export const getBusinessInfo = asyncHandler(async (req, res) => {
	const businessService = new BusinessService(req);
	const data = await businessService.getBusinessInfo();

	return successResponse(res, HttpStatus.OK, GET_BUSINESS_SUCCESS, data);
});

export const createBusiness = asyncHandler(async (req, res) => {
	const businessService = new BusinessService(req);
	const data = await businessService.createBusiness();

	return successResponse(res, HttpStatus.OK, BUSINESS_CREATED_SUCCESS, data);
});

export const setBusinessFavorite = asyncHandler(async (req, res) => {
	const businessService = new BusinessService(req);
	const data = await businessService.setBusinessFavorite();

	return successResponse(res, HttpStatus.OK, BUSINESS_FAVORITED_SUCCESS, data);
});

export const removeFavoriteBusiness = asyncHandler(async (req, res) => {
	const businessService = new BusinessService(req);
	const data = await businessService.removeFavoriteBusiness();

	return successResponse(res, HttpStatus.OK, BUSINESS_FAVORITED_DELETED, data);
});

export const updateBusiness = asyncHandler(async (req, res) => {
	const businessService = new BusinessService(req);
	const data = await businessService.updateBusiness();

	return successResponse(res, HttpStatus.OK, BUSINESS_UPDATED_SUCCESS, data);
});

export const deleteBusiness = asyncHandler(async (req, res) => {
	const businessService = new BusinessService(req);
	const data = await businessService.deleteBusiness();

	return successResponse(res, HttpStatus.OK, BUSINESS_DELETED_SUCCESS, data);
});

export const deleteManyBusiness = asyncHandler(async (req, res) => {
	const businessService = new BusinessService(req);
	const data = await businessService.deleteManyBusiness();

	return successResponse(res, HttpStatus.OK, BUSINESS_DELETED_SUCCESS, data);
});
