const capitalizeFirstLetter = (value) => {
	if (!value) {
		return "";
	}

	const text = String(value).trim();
	return text.charAt(0).toUpperCase() + text.slice(1);
};

const toTitleCase = (value) => {
	if (!value) {
		return "";
	}

	return String(value)
		.trim()
		.split(/\s+/)
		.map(
			(word) =>
				word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
		)
		.join(" ");
};

const formatContactForApi = (contact) => {
	// Contact.date comes back as yyyy-mm-ddT00:00:00.000Z
	// Format to only display yyyy-mm-dd
	const contactObject =
		typeof contact.toObject === "function" ? contact.toObject() : contact;
	// Remove document version from listed data
	const { __v, ...contactData } = contactObject;

	return {
		...contactData,
		// Remove everything after "T"
		birthday: contactData.birthday?.toISOString().split("T")[0],
	};
};

export { capitalizeFirstLetter, toTitleCase, formatContactForApi };
