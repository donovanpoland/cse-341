import { pageMeta } from "../config/pageMeta.js";
import { Contact } from "../models/contactModel.js";

const index = async (req, res) => {
	const contacts = await Contact.find().limit(10).lean();
	// Render page data via objects and variables listed below
	res.render("index", {
		...pageMeta.home,
		contacts,
		//add page data here
	});
};

export { index };
