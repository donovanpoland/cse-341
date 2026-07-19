import { pageMeta } from "../config/pageMeta.js";
import { config } from "../../config.js";

const isDevelopment = config.isDevelopment;

// page/views error handling
const notFound = (req, res, next) => {
	const error = new Error(`Not found: ${req.originalUrl}`);
	error.status = 404;
	next(error);
};

const errorHandler = (error, req, res, next) => {
	if (res.headersSent) {
		return next(error);
	}

	const supportedStatusCodes = new Set([404, 429]);
	const statusCode = supportedStatusCodes.has(error.status)
		? error.status
		: 500;
	const view = `errors/${statusCode}`;
	const meta = pageMeta[statusCode];

	if (statusCode === 500) {
		console.error(error);
	}

	return res.status(statusCode).render(view, {
		...meta,
		isDevelopment,
		error: isDevelopment ? error.message : null,
		stack: isDevelopment ? error.stack : null,
	});
};

/*
API Error Handling
*/

// api route missing/notfound
const apiNotFound = (req, res, next) => {
	const error = new Error(`API route not found: ${req.originalUrl}`);
	error.status = 404;
	error.code = "NOT_FOUND";
	next(error);
};

// catch and normalize server errors
const normalizeApiError = (error) => {
	if (error.name === "ValidationError") {
		error.status = 400;
		error.code = "VALIDATION_ERROR";
		error.details = Object.values(error.errors).map((item) => ({
			field: item.path,
			message: item.message,
		}));
		return error;
	}

	if (error.code === 11000) {
		const alreadyExists = Object.keys(error.keyPattern ?? {})[0] ?? "resource";
		error.status = 409;
		error.code = "CONFLICT";
		error.message = `${alreadyExists} already exists.`;
		return error;
	}

	if (error.name === "CastError") {
		error.status = 400;
		error.code = "BAD_REQUEST";
		error.message = `Invalid ${error.path}.`;
		return error;
	}

	return error;
};

// handle api errors
const apiErrorHandler = (error, req, res, next) => {
	
	if (res.headersSent) {
		return next(error);
	}
	//
	error = normalizeApiError(error);

	const supportedStatusCodes = new Set([400, 404, 409, 429]);
	const status = supportedStatusCodes.has(error.status) ? error.status : 500;

	if (status === 500) {
		console.error(error);
	}

	const defaultErrorCodes = {
		400: "BAD_REQUEST",
		404: "NOT_FOUND",
		409: "CONFLICT",
		429: "RATE_LIMIT_EXCEEDED",
		500: "INTERNAL_SERVER_ERROR",
	};

	const response = {
		status,
		code: error.code ?? defaultErrorCodes[status],
		message:
			status === 500
				? "An unexpected error occurred."
				: error.message,
	};

	if (error.details) {
		response.details = error.details;
	}

	if (isDevelopment) {
		response.stack = error.stack;
	}

	return res.status(status).json(response);
};

const createNotFoundError = (resource, id) => {
	const error = new Error(`No ${resource} found for id "${id}".`);
	error.status = 404;
	error.code = "NOT_FOUND";
	return error;
};

export { notFound, errorHandler, apiNotFound, apiErrorHandler, createNotFoundError };
