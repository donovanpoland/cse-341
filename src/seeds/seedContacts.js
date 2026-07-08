import mongoose from "mongoose";
import connectDB from "../database/mongodb.js";
import { Contact } from "../models/contactModel.js";
import { config } from "../../config.js";

const contacts = [
	{
		firstName: "Donovan",
		lastName: "Poland",
		email: "donovan@example.com",
		phoneNumber: 5555555555,
	},
	{
		firstName: "Hunter",
		lastName: "Poe",
		email: "teacher@example.com",
		phoneNumber: 1111111111,
	},
	{
		firstName: "BYU-I",
		lastName: "Grader",
		email: "grader@example.com",
		phoneNumber: 2222222222,
	},
];

const seedContacts = async () => {
	try {
		await connectDB();

		for (const contact of contacts) {
			await Contact.findOneAndUpdate(
				{
					email: contact.email,
				},
				contact,
				{
					upsert: true,
					returnDocument: "after",
				},
			);
		}

		console.log("Contacts seeded successfully.");
	} catch (error) {
		console.error("Error seeding contacts:", error);
		process.exitCode = 1;
	} finally {
		await mongoose.disconnect();
	}
};

seedContacts();
