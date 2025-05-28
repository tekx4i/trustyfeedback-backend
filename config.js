import dotenv from 'dotenv';

const envFiles = {
	development: '.env.development',
	production: '.env.production',
	staging: '.env.staging',
};

dotenv.config({ path: envFiles[process.env.NODE_ENV] });

export const {
	NODE_ENV,
	PORT,
	ACCESS_TOKEN_SECRET,
	ACCESS_TOKEN_EXPIRY,
	OTP_TOKEN_SECRET,
	OTP_TOKEN_EXPIRY,
	RATE_LIMIT_WINDOW,
	RATE_LIMIT_MAX,
	STRIPE_SECRET_KEY,
	CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
	CLOUDINARY_FOLDER,
	SMTP_PASS,
	FROM_NAME,
	FROM_EMAIL,
	ADMIN_EMAIL,
	SUPPORT_EMAIL,
	FACEBOOK_URL,
	INSTAGRAM_URL,
	TWITTER_URL,
	LINKEIN_URL,
	LIVE_URL,
	FRONTEND_URL,
	ADMIN_URL,
} = process.env;
