import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		trim: true,
		maxLength: 50,
		match: [
			/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/,
			"First name contains invalid characters",
		],
	},
	lastName: {
		type: String,
		required: true,
		trim: true,
		maxLength: 50,
		match: [
			/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/,
			"Last name contains invalid characters",
		],
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		maxLength: 255,
		match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
	},
	favoriteColor: {
		type: String,
		required: true,
		trim: true,
	},
	birthday: {
		type: Date,
		required: true,
		// mongoose validates dates with the Date type
	},
});

export const Contact = mongoose.model("Contact", ContactSchema);
