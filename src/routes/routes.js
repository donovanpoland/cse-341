import { Router } from "express";

import { index } from "../controllers/indexController.js";
import usersRouter from "./users.js";
import contactsRouter from "./contacts.js";

// init Express Router
const router = Router();


//Home
router.get("/", index);

//Authentication
router.use(usersRouter);

// Contacts
router.use("/contacts", contactsRouter);



export default router;
