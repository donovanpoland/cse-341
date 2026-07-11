import mongoose from "mongoose";
import connectDB from "../database/mongodb.js";
import { Contact } from "../models/contactModel.js";
import { config } from "../../config.js";

const contacts = [
	{
		firstName: "Donovan",
		lastName: "Poland",
		email: "donovan@example.com",
		favoriteColor: "red",
		birthday: new Date("1991-09-26"),
	},
	{
		firstName: "Hunter",
		lastName: "Poe",
		email: "teacher@example.com",
		favoriteColor: "green",
		birthday: new Date("1980-05-12"),
	},
	{
		firstName: "BYU-I",
		lastName: "Grader",
		email: "grader@example.com",
		favoriteColor: "blue",
		birthday: new Date("2000-01-01"),
	},
	{
		firstName: "SoloSeed",
		lastName: "Test",
		email: "seedtest@example.com",
		favoriteColor: "purple",
		birthday: new Date("2005-01-01"),
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
