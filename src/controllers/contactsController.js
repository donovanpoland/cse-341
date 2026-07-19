import { config } from "../../config.js";
import { createNotFoundError } from "../middleware/errorMiddleware.js";
import { Contact } from "../models/contactModel.js";
import { formatContactForApi } from "../utils/formatter.util.js";

const isDevelopment = config.isDevelopment;

const getAllContactsJson = async (req, res) => {

	// https://mongoosejs.com/docs/models.html#querying
	const contacts = await Contact.find().lean();

	// contact format helper for cleaner output
	const formattedContacts = contacts.map(formatContactForApi);

	//contact found status ok
	if(isDevelopment){
		console.log("Contacts queried successfully.");
	}
	return res.status(200).json(formattedContacts);
};

const getContactByIdJson = async (req, res) => {
	// get contact from params of request
	const { id } = req.params;
	// https://mongoosejs.com/docs/models.html#querying
	const contactById = await Contact.findById(id).lean();

	// no contact found
	if (!contactById) {
		throw createNotFoundError("contact", id);
	}

	// contact format helper for cleaner output
	const formattedContact = formatContactForApi(contactById);

	if(isDevelopment){
		console.log("Contact query successful.");
	}
	return res.status(200).json(formattedContact);
};

const createContact = async (req, res) => {

	// set variables from body of request
	const { firstName, lastName, email, favoriteColor, birthday } = req.body;

	// https://mongoosejs.com/docs/models.html#constructing-documents
	const newContact = await Contact.create({
		firstName,
		lastName,
		email,
		favoriteColor,
		birthday,
	});

	
	// contact format helper for cleaner output
	const formattedContact = formatContactForApi(newContact);

	//contact created status ok
	if(isDevelopment){
		console.log("Contact Created successfully.");
	}
	return res.status(201).json(formattedContact);
};

const updateContact = async (req, res) => {
	// get contact from params of request
	const { id } = req.params;
	// set variables from request
	const { firstName, lastName, email, favoriteColor, birthday } = req.body;
	// set new contact details
	const newContact = {
		firstName,
		lastName,
		email,
		favoriteColor,
		birthday,
	};
	// check Contact and (findOne) check to see if email already exists (AndUpdate)
	// https://mongoosejs.com/docs/models.html#updating
	const updatedContact = await Contact.findByIdAndUpdate(
		id,
		newContact,
		{
			returnDocument: "after",
			runValidators: true
		},
	);
	// no contact found
	if (!updatedContact) {
		throw createNotFoundError("contact", id);
	}

	// contact format helper for cleaner output
	const formattedContact = formatContactForApi(updatedContact);
	
	//contact updated status ok
	if(isDevelopment){
		console.log("Contact updated successfully.");
	}
	return res.status(200).json(formattedContact);
};

const deleteContact = async (req, res) => {
	// get contact from params of request
	const { id } = req.params;

	// https://mongoosejs.com/docs/models.html#deleting
	// deleteOne() returns a result object like { deletedCount: 1 }, not the deleted contact itself
	// findByIdAndDelete(id) find the Id specifically requested then deletes and returns the deleted document
	const deletedContact = await Contact.findByIdAndDelete(id);

	// no contact found
	if (!deletedContact) {
		throw createNotFoundError("contact", id);
	}

	if(isDevelopment){
		console.log("Contact deleted successfully.");
	}

	// contact format helper for cleaner output
	const formattedContact = formatContactForApi(deletedContact);

	return res.status(200).json({
		message: "Contact deleted successfully.",
		deletedContact: formattedContact,
	});
};

export { getAllContactsJson, getContactByIdJson,
	createContact, 
	updateContact, 
	deleteContact 
};
