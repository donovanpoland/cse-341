import {param, body, validationResult } from "express-validator";

// middleware factory function for view/page validating errors
const handleValidationErrors = (redirectPath, fieldsToPreserve = []) => {
	return (req, res, next) => {
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			return next();
		}
		errors.array().forEach(({ msg }) => {
			req.flash("warning", msg);
		});
		const destination =
			typeof redirectPath === "function"
				? redirectPath(req)
				: redirectPath;
		const formData = Object.fromEntries(
			fieldsToPreserve.map((field) => [field, req.body[field] ?? ""]),
		);
		req.session.formData = formData;
		return res.redirect(303, destination);
	};
};

// middleware factory function for API validating errors
const handleApiValidationErrors = (req, res, next) => {
	const errors = validationResult(req);

	// if there are no errors in the request move on
	if (errors.isEmpty()) {
		return next();
	}

	// when there is an error send the status code/error name, and details to the 
	const error = new Error("Request validation failed");
		error.status = 400;
		error.code = "VALIDATION_ERROR";
		error.details = errors.array().map(({ path, msg }) => ({
			field: path,
			message: msg,
		}));
	
	return next(error);
};

const userValidation = [
	body("firstName")
		.trim()
		.notEmpty()
		.withMessage("First Name required")
		.isLength({ max: 100 })
		.withMessage("First name must be no more than 100 characters"),
	body("lastName")
		.trim()
		.notEmpty()
		.withMessage("Last Name required")
		.isLength({ max: 100 })
		.withMessage("Last name must be no more than 100 characters"),
	body("email")
		.normalizeEmail()
		.notEmpty()
		.withMessage("Email is required")
		.isLength({ max: 255 })
		.withMessage("Email cannot exceed 255 characters")
		.isEmail()
		.withMessage("Please provide a valid email address"),
	body("password")
		.notEmpty()
		.withMessage("Password required")
		.isLength({ min: 8, max: 72 })
		.withMessage("Password must be between 8 and 72 characters long"),
	body("confirmPassword")
		.notEmpty()
		.withMessage("Please confirm password")
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error("Passwords do not match");
			}
			return true;
		}),
]; // end user validation

const loginValidation = [
	body("email")
		.normalizeEmail()
		.notEmpty()
		.isLength({ max: 255 }) // model max 255
		.withMessage("email cannot exceed characters")
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Please provide a valid email address"),
	body("password").notEmpty().withMessage("Password is required"),
]; // end login validation

const contactIdValidation = [
	param("id")
		.isMongoId()// check if it meets the mongodb id type/length/pattern ect.
		.withMessage("Invalid contact id format")
];// end id validation

const contactsValidation = [
	body("firstName")
		.notEmpty()// model requires
		.withMessage("firstName cannot be empty")
		.trim()
		.matches(/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/)
		.withMessage("First name contains invalid characters")
		.isLength({ max: 50 }) // model max 50
		.withMessage("firstName cannot exceed characters"),
	body("lastName")
		.notEmpty()// model requires
		.withMessage("lastName cannot be empty")
		.trim()
		.matches(/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/)
		.withMessage("Last name contains invalid characters")
		.isLength({ max: 50 }) // model max 50
		.withMessage("lastName cannot exceed characters"),
	body("email")
		.normalizeEmail()
		.notEmpty()// model requires
		.withMessage("email cannot be empty")
		.isLength({ max: 255 }) // model max 255
		.withMessage("email cannot exceed characters")
		.isEmail()
		.withMessage("Please provide a valid email address"),
	body("favoriteColor")
		.notEmpty()// model requires
		.withMessage("favoriteColor cannot be empty")
		.trim()
		.isLength({ max: 35 }) // model max 35
		.withMessage("favoriteColor cannot exceed characters"),
	body("birthday")
		.notEmpty()// model requires
		.withMessage("birthday cannot be empty")
		.trim()
		.matches(/^\d{4}-\d{2}-\d{2}$/) // check date format
		.withMessage("birthday must be in YYYY-MM-DD format")
		.isISO8601({ strict: true, strictSeparator: true }) 
		.withMessage("birthday must be a valid calendar date")
];// end contacts validation


export { 
	// page/view validation
	userValidation, loginValidation,
	// API validation
	contactsValidation, contactIdValidation,
	// error handlers
	handleValidationErrors, handleApiValidationErrors 
};
