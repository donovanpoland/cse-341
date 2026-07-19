import { config } from "../../config.js";

import mongoose from "mongoose";

const DB_URL = config.database.url;

//create db connection
const connectDB = async () => {
	try {
		const connectionInstance = await mongoose.connect(DB_URL);
		console.log(
			`MongoDB Connected!\nConnection Host: ${connectionInstance.connection.host}`,
		);
	} catch (error) {
		console.log("MongoDB connection failed", error);
		process.exit(1);
	}
};

//export pool
export default connectDB;
