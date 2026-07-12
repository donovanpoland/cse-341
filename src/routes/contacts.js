import { Router } from "express";

import {
    getAllContactsJson,
    getContactByIdJson,
    createContact,
    updateContact, 
    deleteContact
} from "../controllers/contactsController.js";

// init Express Router
const router = Router();


// Get Contacts
router.get("/", getAllContactsJson);

// get contact
router.get("/:id", getContactByIdJson);

// Create contact
router.post("/", createContact);

// Update Contact
router.put("/:id", updateContact);

// Delete contact
router.delete("/:id", deleteContact);


export default router;