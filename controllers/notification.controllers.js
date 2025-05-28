import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import {
	GET_NOTIFICATION_SUCCESS,
	NOTIFICATION_UPDATED_SUCCESS,
	NOTIFICATION_DELETED_SUCCESS,
} from '../constants';
import { NotificationService } from '../services';
import { successResponse } from '../utils';

export const getAllNotifications = asyncHandler(async (req, res) => {
	const notificationService = new NotificationService(req);
	const data = await notificationService.getAllNotifications();

	return successResponse(res, HttpStatus.OK, GET_NOTIFICATION_SUCCESS, data);
});

export const getNotification = asyncHandler(async (req, res) => {
	const notificationService = new NotificationService(req);
	const data = await notificationService.getNotification();

	return successResponse(res, HttpStatus.OK, GET_NOTIFICATION_SUCCESS, data);
});

export const updateNotification = asyncHandler(async (req, res) => {
	const notificationService = new NotificationService(req);
	const data = await notificationService.updateNotification();

	return successResponse(
		res,
		HttpStatus.OK,
		NOTIFICATION_UPDATED_SUCCESS,
		data,
	);
});

export const readAllNotification = asyncHandler(async (req, res) => {
	const notificationService = new NotificationService(req);
	const data = await notificationService.readAllNotification();

	return successResponse(
		res,
		HttpStatus.OK,
		NOTIFICATION_UPDATED_SUCCESS,
		data,
	);
});

export const deleteNotification = asyncHandler(async (req, res) => {
	const notificationService = new NotificationService(req);
	const data = await notificationService.deleteNotification();

	return successResponse(
		res,
		HttpStatus.OK,
		NOTIFICATION_DELETED_SUCCESS,
		data,
	);
});

export const deleteManyNotification = asyncHandler(async (req, res) => {
	const notificationService = new NotificationService(req);
	const data = await notificationService.deleteManyNotification();

	return successResponse(
		res,
		HttpStatus.OK,
		NOTIFICATION_DELETED_SUCCESS,
		data,
	);
});
