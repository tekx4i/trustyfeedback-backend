import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import {
	GET_PAGE_SUCCESS,
	PAGE_CREATED_SUCCESS,
	PAGE_UPDATED_SUCCESS,
	PAGE_DELETED_SUCCESS,
} from '../constants';
import { PageService } from '../services';
import { successResponse } from '../utils';

export const getAllPages = asyncHandler(async (req, res) => {
	const pageService = new PageService(req);
	const data = await pageService.getAllPages();

	return successResponse(res, HttpStatus.OK, GET_PAGE_SUCCESS, data);
});

export const getPage = asyncHandler(async (req, res) => {
	const pageService = new PageService(req);
	const data = await pageService.getPage();

	return successResponse(res, HttpStatus.OK, GET_PAGE_SUCCESS, data);
});

export const getPageByUrl = asyncHandler(async (req, res) => {
	const pageService = new PageService(req);
	const data = await pageService.getPageByUrl();

	return successResponse(res, HttpStatus.OK, GET_PAGE_SUCCESS, data);
});

export const createPage = asyncHandler(async (req, res) => {
	const pageService = new PageService(req);
	const data = await pageService.createPage();

	return successResponse(res, HttpStatus.OK, PAGE_CREATED_SUCCESS, data);
});

export const updatePage = asyncHandler(async (req, res) => {
	const pageService = new PageService(req);
	const data = await pageService.updatePage();

	return successResponse(res, HttpStatus.OK, PAGE_UPDATED_SUCCESS, data);
});

export const deletePage = asyncHandler(async (req, res) => {
	const pageService = new PageService(req);
	const data = await pageService.deletePage();

	return successResponse(res, HttpStatus.OK, PAGE_DELETED_SUCCESS, data);
});

export const deleteManyPage = asyncHandler(async (req, res) => {
	const pageService = new PageService(req);
	const data = await pageService.deleteManyPage();

	return successResponse(res, HttpStatus.OK, PAGE_DELETED_SUCCESS, data);
});
