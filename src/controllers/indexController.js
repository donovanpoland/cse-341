import { pageMeta } from "../config/pageMeta.js";

const index = async (req, res) => {
	// #swagger.ignore = true
	// Render page data via objects and variables listed below
	res.render("index", {
		...pageMeta.home,
		//add page data here
	});
};

export { index };
