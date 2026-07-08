import { config } from "../../config.js";
import { Role } from "../models/roleModel.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { toTitleCase, capitalizeFirstLetter } from "../utils/formatter.util.js";

const findUserByEmail = async (email) => {
	return await User.findOne({ email: email.toLowerCase().trim() }).populate(
		"role",
	);
};

const authenticateUser = async (email, password) => {
	// get user data
	const user = await findUserByEmail(email);
	if (!user) {
		return null;
	} // User not found
	const passwordIsValid = await verifyPassword(password, user.passwordHash);
	if (!passwordIsValid) {
		return null;
	} // Password does not match
	// return explicate user data, do not include password hash
	return {
		user_id: user._id,
		first_name: capitalizeFirstLetter(user.firstName),
		last_name: capitalizeFirstLetter(user.lastName),
		user_email: user.email,
		role_name: user.role.name,
	};
};

const verifyPassword = async (password, hashedPassword) => {
	return bcrypt.compare(password, hashedPassword);
};

const createUser = async (firstName, lastName, email, password) => {
	const normalizedEmail = email.toLowerCase().trim();

	// Hash the password before storing it
	const salt = await bcrypt.genSalt(10);
	const passwordHash = await bcrypt.hash(password, salt);

	//create default role for first time user
	const defaultRole = await Role.findOne({ name: "user" });
	if (!defaultRole) {
		throw new Error("Role not found");
	}

	// Create the user in the database
	try {
		const user = await User.create({
			firstName,
			lastName,
			email: normalizedEmail,
			passwordHash,
			role: defaultRole._id,
		});

		return user;
	} catch (error) {
		// error code 11000 is the code triggered by the db when unique item matches another
		if (error.code === 11000) {
			throw new Error("That email is already registered.");
		}
		throw error;
	}
};

export { createUser, findUserByEmail, authenticateUser };
