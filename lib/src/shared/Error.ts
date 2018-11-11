export const customError = function(
	name: string,
	message: string,
	responseCode: number
) {
	Error.captureStackTrace(this, this.constructor);
	this.name = name;
	this.message = message;
	this.code = responseCode;
};
