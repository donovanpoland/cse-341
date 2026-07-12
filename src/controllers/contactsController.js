import { Contact } from "../models/contactModel.js";

const getAllContactsJson = async (req, res) => {
	try {
		// https://mongoosejs.com/docs/models.html#querying
		const contacts = await Contact.find().lean();

		// Contact.date comes back as yyyy-mm-ddT00:00:00.000Z
		// Format to only display yyyy-mm-dd
		const formattedContacts = contacts.map((contact) => ({
			...contact,
			// Remove everything after "T"
			birthday: contact.birthday?.toISOString().split("T")[0],
		}));

		//contact found status ok
		console.log("Contacts queried successfully.");
		return res.status(200).json(formattedContacts);
	} catch (error) {

		return res.status(500).json({
			message: "Failed to fetch contacts.",
			error: error.message,
		});
	}
};

const getContactByIdJson = async (req, res) => {
	try {
		const { id } = req.params;
		// https://mongoosejs.com/docs/models.html#querying
		const contactById = await Contact.findById(id).lean();

		// no contact found
		if (!contactById) {
			return res.status(404).json({
				message: `No contact found for id "${id}".`,
			});
		}

		// Contact.date comes back as yyyy-mm-ddT00:00:00.000Z
		// Format to only display yyyy-mm-dd
		const formattedContact = {
			...contactById,
			// Remove everything after "T"
			birthday: contactById.birthday?.toISOString().split("T")[0],
		};

		console.log("Contact query successful.");
		return res.status(200).json(formattedContact);
	} catch (error) {
		if (error.name === "CastError") {
			return res.status(400).json({
				message: `Invalid contact id "${req.params.id}".`,
				error: error.message,
			});
		}

		return res.status(500).json({
			message: "Failed to fetch contact.",
			error: error.message,
		});
	}
};

const createContact = async (req, res) => {
	try {
		// set variables from request
		const { firstName, lastName, email, favoriteColor, birthday } = req.body;
	
		// https://mongoosejs.com/docs/models.html#constructing-documents
		const newContact = await Contact.create({
			firstName,
			lastName,
			email,
			favoriteColor,
			birthday,
		});

		const formattedContact = {
			...newContact.toObject(),
			birthday: newContact.birthday?.toISOString().split("T")[0],
		};

		//contact created status ok
		console.log("Contact Created successfully.");
		return res.status(201).json(formattedContact);
	} catch (error) {
		return res.status(500).json({
			message: "Error creating contact:",
			error: error.message,
		});

	}
};

const updateContact = async (req, res) => {

	try{
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
			req.params.id,
			newContact,
			{
				returnDocument: "after",
				runValidators: true
			},
		);

		if (!updatedContact){
			return res.status(404).json({
				message: `No contact found for id "${req.params.id}".`,
			});
		}

		const formattedContact = {
			...updatedContact.toObject(),
			birthday: updatedContact.birthday?.toISOString().split("T")[0],
		};

		//contact updated status ok
		console.log("Contact updated successfully.");
		return res.status(200).json(formattedContact);
		
	} catch (error) {

		if (error.name === "CastError") {
			return res.status(400).json({
				message: `Invalid contact id "${req.params.id}".`,
				error: error.message,
			});
		}

		return res.status(500).json({
			message: "Error updating contact:",
			error: error.message,
		});
	}
	
};

const deleteContact = async (req, res) => {

	
	try {
		const { id } = req.params;
		//https://mongoosejs.com/docs/models.html#deleting
		// deleteOne() returns a result object like { deletedCount: 1 }, not the deleted contact itself
		// findByIdAndDelete(id) find the Id specifically requested then deletes and returns the deleted document
		const deletedContact = await Contact.findByIdAndDelete(id);

		if (!deletedContact) {
			return res.status(404).json({
			  	message: `No contact found for id "${id}".`,
			});
		}

		return res.status(200).json({
			message: "Contact deleted successfully.",
			deletedContact,
		});
		
	} catch (error) {

		if (error.name === "CastError") {
			return res.status(400).json({
			  	message: `Invalid contact id "${req.params.id}".`,
			  	error: error.message,
			});
		}

		return res.status(500).json({
			message: "Error deleting contact:",
			error: error.message,
		});
	}
	
};

export { getAllContactsJson, getContactByIdJson,
	createContact, 
	updateContact, 
	deleteContact 
};
