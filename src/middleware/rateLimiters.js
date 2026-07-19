import { rateLimit } from "express-rate-limit";

const sharedOptions = {
	// use modern headers
	standardHeaders: "draft-8",
	// disable older header format
	legacyHeaders: false,
	// set status code
	statusCode: 429,
	// hand errors off to centralized error handling
	handler: (req, res, next, options) => {
		const error = new Error(options.message);
		error.status = options.statusCode;
		next(error);
	},
};

const fifteenMinutes = 15 * 60 * 1000;
const oneHour = 60 * 60 * 1000;
const oneDay = 24 * 60 * 60 * 1000;

const sharedApiLimiterOptions = {
	// use modern headers
	standardHeaders: "draft-8",
	// disable older header format
	legacyHeaders: false,
	handler: (req, res, next, options) => {
		const error = new Error(options.message);
		// rate limit reached statusCode
		error.status = 429;
		error.code = "RATE_LIMIT_EXCEEDED";
		// continue to next route/middleware
		next(error);
	}
};

const loginLimiter = rateLimit({
	...sharedOptions,
	windowMs: fifteenMinutes,
	limit: 5,
	message: "Too many login attempts. Please try again later",
});

const registrationLimiter = rateLimit({
	...sharedOptions,
	windowMs: oneHour,
	limit: 3,
	message: "Too many registration attempts. Please try again later.",
});

// API middleware factory function using express rateLimit()
const makeApiLimiter = ({ windowMs, limit, message }) =>
	rateLimit({
		// shared headers and options to keep everything uniform
		...sharedApiLimiterOptions,
		windowMs,
		limit,
		message,
		// api-specific handler here
	});

const readContactsBurstLimiter = makeApiLimiter({
	windowMs: fifteenMinutes, // 15 min
	limit: 100,
	message: "Too many contact read requests. Please try again later.",
});

const readContactsDailyLimiter = makeApiLimiter({
	windowMs: oneDay, // 1 day
	limit: 2000,
	message: "Too many contact read requests. Please try again later.",
});

const writeContactsBurstLimiter = makeApiLimiter({
	windowMs: fifteenMinutes, // 15 min
	limit: 20,
	message: "Too many contact write requests. Please try again later.",
});

const writeContactsDailyLimiter = makeApiLimiter({
	windowMs: oneDay, // 1 day
	limit: 300,
	message: "Too many contact write requests. Please try again later.",
});

export { 
	// view/page limiters
	loginLimiter, registrationLimiter, 
	// api limiters
	readContactsBurstLimiter, writeContactsBurstLimiter,
	readContactsDailyLimiter, writeContactsDailyLimiter	
};
