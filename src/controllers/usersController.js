import { pageMeta } from "../config/pageMeta.js";
import { User } from "../models/userModel.js";
import { createUser, authenticateUser } from "../services/userService.js";
import { config } from "../../config.js";
import { toTitleCase, capitalizeFirstLetter } from "../utils/formatter.util.js";

const isDevelopment = config.isDevelopment;

// render user registration form with applicable data
const userRegistrationForm = async (req, res) => {
	// #swagger.ignore = true
	// set form data if saved in session
	const formData = req.session.formData ?? {};
	// Remove old session data
	delete req.session.formData;

	// render registration data
	res.render("users/register-user", {
		...pageMeta.registration,
		// get saved form data
		email: formData.email ?? "",
		firstName: formData.firstName ?? "",
		lastName: formData.lastName ?? "",
	});
};

// save user to database and redirect
const processUserRegistration = async (req, res) => {
	// #swagger.ignore = true
	// initialize body info
	const { firstName, lastName, email, password } = req.body;

	try {
		// Create the user in the database
		await createUser(firstName, lastName, email, password);

		if (isDevelopment) {
			console.log("Successfully registered user");
		}
		// Redirect to the login page after successful registration
		req.flash("success", "Registration successful! Please log in.");
		return res.redirect(303, "/login-user");
	} catch (error) {
		if (isDevelopment) {
			console.error("Error registering user:", error);
		}
		req.flash(
			"error",
			"That email is already registered. Please log in or use a different email.",
		);
		req.session.formData = { firstName, lastName, email };
		return res.redirect(303, "/register-user");
	}
};

// render login form with applicable data
const loginForm = (req, res) => {
	// #swagger.ignore = true
	// reset form data if saved in session
	const formData = req.session.formData ?? {};
	delete req.session.formData;

	// Render login data
	res.render("users/login-user", {
		// Get page meta data
		...pageMeta.login,
		// get saved form data
		email: formData.email ?? "",
	});
};

// authenticate, login user and redirect
const processLogin = async (req, res, next) => {
	// #swagger.ignore = true
	// initialize body info
	const { email, password } = req.body;

	try {
		// authenticate user data
		const user = await authenticateUser(email, password);
		if (user) {
			// Delete stored session data
			delete req.session.formData;
			// Store user info in session
			req.session.user = user;
			// Display login successful flash message
			req.flash(
				"success",
				`Welcome ${user.first_name} ${user.last_name}, you have been successfully logged in!`,
			);

			if (isDevelopment) {
				console.log("User logged in:", user);
			}
			// exit controller and redirect to home on success
			return res.redirect(303, "/");
		}
	} catch (error) {
		if (isDevelopment) {
			console.error("User failed login:", user);
		}
		// get email from session
		req.session.formData = { email };
		// warn user
		req.flash("warning", "Invalid email or password.");
		// exit controller and redirect to log in
		return res.redirect(303, "/login-user");
	}
};

// log out user, delete session data and redirect
const processLogout = async (req, res) => {
	// #swagger.ignore = true
	// get the user session and destroy it on logout
	req.session.destroy((err) => {
		if (err) return res.redirect(303, "/dashboard");
		//clear cookie with session id
		res.clearCookie("connect.sid");
		// Message user of logout
		req.flash("success", "Logout successful!");
		// Redirect to login page
		return res.redirect(303, "/login-user");
	});
};

// require login for specific features to be accessed
const requireLogin = (req, res, next) => {
	// #swagger.ignore = true
	// check for user session
	if (!req.session || !req.session.user) {
		// send message if not logged in
		req.flash("warning", "You must be logged in to access that page.");
		// Redirect to login page
		return res.redirect(303, "/login-user");
	}
	next();
};

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 *
 * @param {string} role - The role name required (e.g., 'admin', "member",  'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
	return (req, res, next) => {
		// Check if user is logged in first
		if (!req.session || !req.session.user) {
			// send message to user about login requirement
			req.flash("error", "You must be logged in to access this page.");
			return res.redirect(303, "/login-user");
		}

		// Check if user's role matches the required role
		if (req.session.user.role_name !== role) {
			// send message to user about page permission
			req.flash(
				"error",
				"You do not have permission to access this page." +
					"\nIf you believe this to be an error, please contact your administrator.",
			);
			// redirect to home page
			return res.redirect(303, "/");
		}

		// User has required role, continue
		next();
	};
};

export {
	//pages
	userRegistrationForm,
	loginForm,
	//processing
	processUserRegistration,
	processLogin,
	processLogout,
	//required
	requireLogin,
	requireRole,
};
