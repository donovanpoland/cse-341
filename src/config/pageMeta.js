import { createMetaData } from "../utils/metaUtil.js";
import { config } from "../../config.js";

const siteName = config.name;

export const pageMeta = {
	// home page
	home: createMetaData(
		"Home",
		["Home", siteName, "", ""],
		`Welcome to ${siteName}.`,
	),
	// 404 error page
	404: createMetaData(
		"Error 404 Page Not Found",
		["missing page", siteName, "error 404"],
		"An error has occurred, the page you are looking for is missing or not available.",
		"noindex, nofollow",
	),
	// 500 error page
	500: createMetaData(
		"500 Internal Server Error",
		["server error", siteName, "error 500"],
		"Something Went Wrong, The server encountered an error while processing your request.",
		"noindex, nofollow",
	),
	// 429 warning page
	429: createMetaData(
		"429 Too Many Attempts",
		["rate limit", siteName, "error 429"],
		"Too many login or registration attempts were made. Please wait before trying again.",
		"noindex, nofollow",
	),
	// user registration page
	registration: createMetaData(
		"Registration",
		["Create New user", "New account", "Join"],
		"Enter user details to register for an account.",
	),
	// user login page
	login: createMetaData(
		"Please login",
		["login"],
		"You are not logged in, to gain access to your account again please enter your user name and password.",
	),
};
