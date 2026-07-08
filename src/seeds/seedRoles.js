import mongoose from "mongoose";
import connectDB from "../database/mongodb.js";
import { Role } from "../models/roleModel.js";
import { config } from "../../config.js";

const roles = [
	{ name: "admin", description: "Administrator with full system access" },
	{ name: "member", description: "Paid user with more access than basic" },
	{ name: "user", description: "Standard user with basic access" },
];

const seedRoles = async () => {
	try {
		await connectDB();

		for (const role of roles) {
			await Role.findOneAndUpdate(
				{
					name: role.name,
				},
				role,
				{
					upsert: true,
					returnDocument: "after",
				},
			);
		}

		console.log("Roles seeded successfully.");
	} catch (error) {
		console.error("Error seeding roles:", error);
		process.exitCode = 1;
	} finally {
		await mongoose.disconnect();
	}
};

seedRoles();
