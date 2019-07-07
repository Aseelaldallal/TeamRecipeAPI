export const CustomError = function(name: string, message: string, responseCode: number) {
	Error.captureStackTrace(this, this.constructor);
	this.name = name;
	this.message = message;
	this.code = responseCode;
};

export const CustomError2 = function(
	name: string,
	type: string,
	message: string,
	responseCode: number
) {
	Error.captureStackTrace(this, this.constructor);
	this.name = name;
	this.message = message;
	this.type = type;
	this.code = responseCode;
};
