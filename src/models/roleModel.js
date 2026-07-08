import mongoose, { Schema, Types } from "mongoose";

const roleSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	description: {
		type: String,
		required: true,
		trim: true,
	},
});

// user, member, admin

export const Role = mongoose.model("Role", roleSchema);
