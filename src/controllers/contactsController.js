import { Contact } from "../models/contactModel.js";

const getAllContactsJson = async (req, res) => {
	try {
		const contacts = await Contact.find().lean();

		return res.status(200).json(contacts);
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

		if (!contactById) {
			return res.status(404).json({
				message: `No contact found for id "${id}".`,
			});
		}

		return res.status(200).json(contactById);
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
