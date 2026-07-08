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
	phoneNumber: {
		type: String,
		required: true,
		trim: true,
		match: [
			/^\+?[0-9\s\-()]{7,20}$/,
			"Please provide a valid phone number",
		],
	},
});

export const Contact = mongoose.model("Contact", ContactSchema);
