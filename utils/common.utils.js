import { PrismaClient } from '@prisma/client';

import { notification } from './notify.utils';
import { createOtpToken } from './token.utils';

const prisma = new PrismaClient();

export async function createOTP(userID, type, review = false) {
	const OTP = Math.floor(1000 + Math.random() * 9000);

	const rememberToken = createOtpToken({
		userId: userID,
		OTP,
		type,
		...(review ? { review } : {}),
	});

	const updateRecord = await prisma.user.update({
		where: {
			id: parseInt(userID, 10),
		},
		data: {
			remember_token: rememberToken,
		},
	});

	let template = 'OTP';
	const data = {
		subject: 'OTP',
		otp: OTP,
	};
	if (type === 'verify') {
		data.subject = 'Verify Your Trusty Feedback Account';
		template = 'verifyOTP';
	} else if (type === 'reset') {
		data.subject = 'Reset Your Password';
		template = 'resetOTP';
	}
	notification(updateRecord, 'mail', data, template);

	updateRecord.OTP = OTP;

	return updateRecord;
}

export async function getAdminOption(key) {
	const record = await prisma.admin_options.findUnique({
		where: {
			key,
		},
	});
	return record?.value ?? null;
}
