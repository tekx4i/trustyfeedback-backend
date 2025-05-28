import asyncHandler from 'express-async-handler';
import HttpStatus from 'http-status-codes';

import {
	GET_STORY_SUCCESS,
	STORY_CREATED_SUCCESS,
	STORY_UPDATED_SUCCESS,
	STORY_DELETED_SUCCESS,
} from '../constants';
import { StoryService } from '../services';
import { successResponse } from '../utils';

export const getAllStories = asyncHandler(async (req, res) => {
	const storyService = new StoryService(req);
	const data = await storyService.getAllStories();

	return successResponse(res, HttpStatus.OK, GET_STORY_SUCCESS, data);
});

export const getStory = asyncHandler(async (req, res) => {
	const storyService = new StoryService(req);
	const data = await storyService.getStory();

	return successResponse(res, HttpStatus.OK, GET_STORY_SUCCESS, data);
});

export const createStory = asyncHandler(async (req, res) => {
	const storyService = new StoryService(req);
	const data = await storyService.createStory();

	return successResponse(res, HttpStatus.OK, STORY_CREATED_SUCCESS, data);
});

export const updateStory = asyncHandler(async (req, res) => {
	const storyService = new StoryService(req);
	const data = await storyService.updateStory();

	return successResponse(res, HttpStatus.OK, STORY_UPDATED_SUCCESS, data);
});

export const deleteStory = asyncHandler(async (req, res) => {
	const storyService = new StoryService(req);
	const data = await storyService.deleteStory();

	return successResponse(res, HttpStatus.OK, STORY_DELETED_SUCCESS, data);
});

export const deleteManyStory = asyncHandler(async (req, res) => {
	const storyService = new StoryService(req);
	const data = await storyService.deleteManyStory();

	return successResponse(res, HttpStatus.OK, STORY_DELETED_SUCCESS, data);
});
