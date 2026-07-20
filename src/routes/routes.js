import { Router } from "express";

import { index } from "../controllers/indexController.js";
import usersRouter from "./usersRoute.js";
import contactsRouter from "./contactsRoute.js";

// init Express Router
const router = Router();


//Home
// #swagger.ignore = true
router.get("/", index);

//Authentication
// #swagger.ignore = true
router.use(usersRouter);

// Contacts
router.use("/contacts", contactsRouter);

// import to app.js
export default router;
