import { Contact } from "../models/contactModel.js";

const getAllContactsJson = async (req, res) => {
	try {
		const contacts = await Contact.find().lean();

		// contacts not found
		if (!contacts) {
			return res.status(404).json({
				message: "No contacts found.",
			});
		}

		// Contact.date comes back as yyyy-mm-ddT00:00:00.000Z
		// Format to only display yyyy-mm-dd
		const formattedContacts = contacts.map((contacts) => ({
			...contacts,
			// Remove everything after "T"
			birthday: contacts.birthday?.toISOString().split("T")[0],
		}));

		//contact found status ok
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

export { getAllContactsJson, getContactByIdJson };
