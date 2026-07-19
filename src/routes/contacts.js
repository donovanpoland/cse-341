import { Router } from "express";

import { 
    readContactsBurstLimiter, writeContactsBurstLimiter,
    readContactsDailyLimiter, writeContactsDailyLimiter 
} from "../middleware/rateLimiters.js";

import {
    getAllContactsJson,
    getContactByIdJson,
    createContact,
    updateContact, 
    deleteContact
} from "../controllers/contactsController.js";

// Validation
import { handleApiValidationErrors, contactsValidation, contactIdValidation } from "../controllers/validationController.js";

// Errors
import { apiNotFound, apiErrorHandler } from "../middleware/errorMiddleware.js";

// init Express Router
const router = Router();


// Get Contacts
router.get("/",
    // limit number of read requests
    readContactsBurstLimiter,
    readContactsDailyLimiter,
    // call controller
    getAllContactsJson);

// get contact
router.get("/:id",
    // limit number of read requests
    readContactsBurstLimiter,
    readContactsDailyLimiter,
    // validate id
    contactIdValidation,
    // Handle errors
    handleApiValidationErrors,
    // call controller
    getContactByIdJson);

// Create contact
router.post("/",
    // limit number of write requests
    writeContactsBurstLimiter,
    writeContactsDailyLimiter, 
    // validate contact info
    contactsValidation, 
    // Handle errors
    handleApiValidationErrors, 
    // call controller
    createContact);

// Update Contact
router.put("/:id",
    // limit number of write requests
    writeContactsBurstLimiter,
    writeContactsDailyLimiter, 
    // validate id
    contactIdValidation,
    // validate contact info
    contactsValidation,
    // Handle errors
    handleApiValidationErrors, 
    // call controller
    updateContact);

// Delete contact
router.delete("/:id",
    // limit number of write requests
    writeContactsBurstLimiter,
    writeContactsDailyLimiter, 
    // validate id
    contactIdValidation,
    // Handle errors
    handleApiValidationErrors, 
    // call controller
    deleteContact);

// error handling routes
router.use(apiNotFound);
router.use(apiErrorHandler);
    

export default router;