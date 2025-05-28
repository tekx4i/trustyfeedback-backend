import { PrismaClient } from '@prisma/client';
import HttpStatus from 'http-status-codes';

import {
	UNAUTHORIZED,
	OTP_NOT_FOUND,
	USER_NOT_FOUND,
	OTP_NOT_VERIFIED,
	NOT_ENOUGH_RIGHTS,
	INVALID_ACCESS_TOKEN,
} from '../constants';
import { AppError } from '../errors';
import { verifyAccessToken, verifyOtpToken } from '../utils';

const prisma = new PrismaClient();

export const isAuth = async (req, res, next) => {
	try {
		if (!req.headers.authorization)
			throw new AppError(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
		const token = req.headers.authorization.split(' ')[1];
		const decoded = await verifyAccessToken(token);

		if (!decoded || !decoded.id)
			throw new AppError(INVALID_ACCESS_TOKEN, HttpStatus.UNAUTHORIZED);
		const user = await prisma.user.findUnique({
			where: {
				deleted: false,
				id: decoded.id,
			},
		});
		if (!user || !user.id)
			throw new AppError(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
		req.user = user;
		next();
	} catch (error) {
		next(error);
	}
};

export const optionalAuth = async (req, res, next) => {
	try {
		if (!req.headers.authorization) {
			req.user = null;
			return next();
		}

		const token = req.headers.authorization.split(' ')[1];
		const decoded = await verifyAccessToken(token);

		if (!decoded || !decoded.id) {
			req.user = null;
			return next();
		}

		const user = await prisma.user.findUnique({
			where: {
				id: decoded.id,
				deleted: false,
			},
		});

		if (!user) {
			req.user = null;
			return next();
		}

		req.user = user;
		return next();
	} catch (error) {
		req.user = null;
		return next();
	}
};

export const isAdmin = async (req, res, next) => {
	try {
		if (!req.headers.authorization)
			throw new AppError(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
		const token = req.headers.authorization.split(' ')[1];
		const decoded = await verifyAccessToken(token);

		if (!decoded || !decoded.id)
			throw new AppError(INVALID_ACCESS_TOKEN, HttpStatus.UNAUTHORIZED);
		const user = await prisma.user.findUnique({
			where: {
				deleted: false,
				id: decoded.id,
			},
		});
		if (!user || !user.id)
			throw new AppError(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);

		if (user.role_id !== 1)
			throw new AppError(NOT_ENOUGH_RIGHTS, HttpStatus.FORBIDDEN);

		req.user = user;
		next();
	} catch (error) {
		next(error);
	}
};

export const resetCheck = async (req, res, next) => {
	try {
		if (!req.headers.authorization)
			throw new AppError(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
		const token = req.headers.authorization.split(' ')[1];
		const decoded = await verifyOtpToken(token);

		if (!decoded || !decoded.userId)
			throw new AppError(INVALID_ACCESS_TOKEN, HttpStatus.UNAUTHORIZED);
		const user = await prisma.user.findUnique({
			where: {
				deleted: false,
				id: decoded.userId,
				remember_token: token,
			},
		});
		if (!user || !user.id)
			throw new AppError(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
		req.user = user;
		next();
	} catch (error) {
		next(error);
	}
};

export const checkAuth = async (req, res, next) => {
	try {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = await verifyAccessToken(token);

			if (!decoded || !decoded.id)
				throw new AppError(INVALID_ACCESS_TOKEN, HttpStatus.UNAUTHORIZED);
			const user = await prisma.user.findUnique({
				where: {
					deleted: false,
					id: decoded.id,
				},
			});
			if (!user || !user.id)
				throw new AppError(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
			req.user = user;
		}
		next();
	} catch (error) {
		next(error);
	}
};

export const verifyOTP = async (req, res, next) => {
	try {
		let { user } = req;
		const { otp } = req.body;

		if (!user) {
			const { id } = req.params;
			user = await prisma.user.findUnique({
				where: {
					deleted: false,
					id: parseInt(id, 10),
				},
			});
		}

		if (!user || !user.id)
			throw new AppError(USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);

		if (!user.remember_token)
			throw new AppError(OTP_NOT_FOUND, HttpStatus.UNAUTHORIZED);

		const decoded = await verifyOtpToken(user.remember_token);

		if (
			!decoded ||
			!decoded.userId ||
			!decoded.OTP ||
			parseInt(decoded.OTP, 10) !== parseInt(otp, 10)
		)
			throw new AppError(OTP_NOT_VERIFIED, HttpStatus.UNAUTHORIZED);

		req.type = decoded.type ? decoded.type : 'verify';
		req.review = decoded.review ? decoded.review : false;
		req.user = user;
		next();
	} catch (error) {
		next(error);
	}
};

export const authorize = roles => {
	return (req, res, next) => {
		if (roles.includes(req.user.role)) return next();
		throw new AppError(NOT_ENOUGH_RIGHTS, HttpStatus.FORBIDDEN);
	};
};

export const varifyReviewOTP = async (req, res, next) => {
	try {
		const { user } = req;
		const { otp } = req.body;

		if (!user || !user.id || !user.remember_token)
			throw new AppError(USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);

		const decoded = await verifyOtpToken(user.remember_token);

		if (
			!decoded ||
			!decoded.userId ||
			!decoded.OTP ||
			!decoded.review ||
			parseInt(decoded.OTP, 10) !== parseInt(otp, 10)
		)
			throw new AppError(OTP_NOT_VERIFIED, HttpStatus.UNAUTHORIZED);

		req.type = decoded.type ? decoded.type : 'verify';
		req.review = decoded.review ? decoded.review : false;
		req.user = user;
		next();
	} catch (error) {
		next(error);
	}
};
