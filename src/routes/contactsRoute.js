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


// Get all Contacts
router.get("/",
    // #swagger.tags = ['Contacts']
    // #swagger.responses[200] = { description: 'Contacts retrieved successfully' }
    // #swagger.responses[429] = { description: 'Rate limit exceeded' }
    // #swagger.responses[500] = { description: 'Internal server error' }
    // limit number of read requests
    readContactsBurstLimiter,
    readContactsDailyLimiter,
    // call controller
    getAllContactsJson);

// get single Contact
router.get("/:id",
    // #swagger.tags = ['Contacts']
    // #swagger.parameters['id']
    // #swagger.responses[200] = { description: 'Contact retrieved successfully' }
    // #swagger.responses[400] = { description: 'Invalid contact id format' }
    // #swagger.responses[404] = { description: 'Contact not found' }
    // #swagger.responses[429] = { description: 'Rate limit exceeded' }
    // #swagger.responses[500] = { description: 'Internal server error' }
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
    // #swagger.tags = ['Contacts']
    // #swagger.parameters['body']
    // #swagger.responses[201] = { description: 'Contact created successfully' }
    // #swagger.responses[400] = { description: 'Request validation failed' }
    // #swagger.responses[409] = { description: 'Conflict' }
    // #swagger.responses[429] = { description: 'Rate limit exceeded' }
    // #swagger.responses[500] = { description: 'Internal server error' }
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
    // #swagger.tags = ['Contacts']
    // #swagger.parameters['id']
    // #swagger.parameters['body']
    // #swagger.responses[200] = { description: 'Contact updated successfully' }
    // #swagger.responses[400] = { description: 'Request validation failed' }
    // #swagger.responses[404] = { description: 'Contact not found' }
    // #swagger.responses[409] = { description: 'Conflict' }
    // #swagger.responses[429] = { description: 'Rate limit exceeded' }
    // #swagger.responses[500] = { description: 'Internal server error' }
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
    // #swagger.tags = ['Contacts']
    // #swagger.parameters['id']
    // #swagger.responses[200] = { description: 'Contact deleted successfully' }
    // #swagger.responses[400] = { description: 'Invalid contact id format' }
    // #swagger.responses[404] = { description: 'Contact not found' }
    // #swagger.responses[429] = { description: 'Rate limit exceeded' }
    // #swagger.responses[500] = { description: 'Internal server error' }
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
