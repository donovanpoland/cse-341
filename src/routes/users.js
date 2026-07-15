import { Router } from "express";

//users
import {
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
} from "../controllers/usersController.js";

// middleware rate limiters
import {
    loginLimiter,
    registrationLimiter,
} from "../middleware/rateLimiters.js";

// Validation imports
import {
    userValidation,
    loginValidation,
    handleValidationErrors,
} from "../controllers/validationController.js";

// init Express Router
const router = Router();

//Register
// #swagger.ignore = true
router.get("/register-user", userRegistrationForm).post(
    "/register-user",
    // limit number of registrations
    registrationLimiter,
    // Validate request
    userValidation,
    // Handle errors and preserve first and last names and email on validation error
    handleValidationErrors("/register-user", [
        "firstName",
        "lastName",
        "email",
    ]),
    // proceed with registration
    processUserRegistration,
);

//Login
// #swagger.ignore = true
router.get("/login-user", loginForm).post(
    "/login-user",
    // limit number of logins
    loginLimiter,
    // Validate request
    loginValidation,
    // Handle errors and preserve email on validation error
    handleValidationErrors("/login-user", ["email"]),
    // Proceed to login user
    processLogin,
);

//Logout
// #swagger.ignore = true
router.post("/logout-user", processLogout);

export default router;