import mongoose from "mongoose";
const {Schema, model} = mongoose;

const ContactSchema = new Schema(
	{
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
			maxLength: 35,
			trim: true,
		},
		birthday: {
			type: Date,
			required: true,
			// match will only work if cast to string instead of date
			// match: [/^\d{4}-\d{2}-\d{2}$/, "birthday must be in YYYY-MM-DD format"] 
			// mongoose validates dates with the Date type
		},
	}, // close schema object
	{
		// https://mongoosejs.com/docs/guide.html#options
		// mongoose options
	}
);

export const Contact = model("Contact", ContactSchema);
