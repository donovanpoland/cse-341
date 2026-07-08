import mongoose, { Schema, Types } from "mongoose";

const userSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			lowercase: true,
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
			lowercase: true,
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
		passwordHash: {
			type: String,
			required: true,
			maxLength: 72,
		},
		role: {
			type: Schema.Types.ObjectId,
			ref: "Role",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

// JS model variable: User
// Mongoose model name: "User"
export const User = mongoose.model("User", userSchema);
