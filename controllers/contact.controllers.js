import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import {
	GET_CONTACT_SUCCESS,
	CONTACT_CREATED_SUCCESS,
	CONTACT_UPDATED_SUCCESS,
	CONTACT_DELETED_SUCCESS,
} from '../constants';
import { ContactService } from '../services';
import { successResponse } from '../utils';

export const getAllContacts = asyncHandler(async (req, res) => {
	const contactService = new ContactService(req);
	const data = await contactService.getAllContacts();

	return successResponse(res, HttpStatus.OK, GET_CONTACT_SUCCESS, data);
});

export const getContact = asyncHandler(async (req, res) => {
	const contactService = new ContactService(req);
	const data = await contactService.getContact();

	return successResponse(res, HttpStatus.OK, GET_CONTACT_SUCCESS, data);
});

export const createContact = asyncHandler(async (req, res) => {
	const contactService = new ContactService(req);
	const data = await contactService.createContact();

	return successResponse(res, HttpStatus.OK, CONTACT_CREATED_SUCCESS, data);
});

export const updateContact = asyncHandler(async (req, res) => {
	const contactService = new ContactService(req);
	const data = await contactService.updateContact();

	return successResponse(res, HttpStatus.OK, CONTACT_UPDATED_SUCCESS, data);
});

export const deleteContact = asyncHandler(async (req, res) => {
	const contactService = new ContactService(req);
	const data = await contactService.deleteContact();

	return successResponse(res, HttpStatus.OK, CONTACT_DELETED_SUCCESS, data);
});

export const deleteManyContact = asyncHandler(async (req, res) => {
	const contactService = new ContactService(req);
	const data = await contactService.deleteManyContact();

	return successResponse(res, HttpStatus.OK, CONTACT_DELETED_SUCCESS, data);
});
