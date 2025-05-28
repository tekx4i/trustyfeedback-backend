import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import {
	GET_BADGE_SUCCESS,
	BADGE_CREATED_SUCCESS,
	BADGE_UPDATED_SUCCESS,
	BADGE_DELETED_SUCCESS,
} from '../constants';
import { BadgeService } from '../services';
import { successResponse } from '../utils';

export const getAllBadges = asyncHandler(async (req, res) => {
	const badgeService = new BadgeService(req);
	const data = await badgeService.getAllBadges();

	return successResponse(res, HttpStatus.OK, GET_BADGE_SUCCESS, data);
});

export const getBadge = asyncHandler(async (req, res) => {
	const badgeService = new BadgeService(req);
	const data = await badgeService.getBadge();

	return successResponse(res, HttpStatus.OK, GET_BADGE_SUCCESS, data);
});

export const createBadge = asyncHandler(async (req, res) => {
	const badgeService = new BadgeService(req);
	const data = await badgeService.createBadge();

	return successResponse(res, HttpStatus.OK, BADGE_CREATED_SUCCESS, data);
});

export const updateBadge = asyncHandler(async (req, res) => {
	const badgeService = new BadgeService(req);
	const data = await badgeService.updateBadge();

	return successResponse(res, HttpStatus.OK, BADGE_UPDATED_SUCCESS, data);
});

export const deleteBadge = asyncHandler(async (req, res) => {
	const badgeService = new BadgeService(req);
	const data = await badgeService.deleteBadge();

	return successResponse(res, HttpStatus.OK, BADGE_DELETED_SUCCESS, data);
});

export const deleteManyBadge = asyncHandler(async (req, res) => {
	const badgeService = new BadgeService(req);
	const data = await badgeService.deleteManyBadge();

	return successResponse(res, HttpStatus.OK, BADGE_DELETED_SUCCESS, data);
});
