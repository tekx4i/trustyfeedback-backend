export class AppError extends Error {
	constructor(message, statusCode, data = []) {
		super(message);
		this.statusCode = statusCode;
		this.payload = data;
		this.isOperational = true;
		Error.captureStackTrace(this, this.constructor);
		Object.setPrototypeOf(this, AppError.prototype);
	}
}
