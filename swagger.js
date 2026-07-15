import swaggerAutogen from "swagger-autogen";

// https://swagger-autogen.github.io/docs/getting-started/advanced-usage
const document = {
	info: {
		version: "1.0.0",
		title: "CSE 341 Contacts API",
		description:
			"Express API for user authentication and contact management.",
	},
    // Update based on environment for testing
    // Production: contacts-api-g59t.onrender.com || Development: 127.0.0.1:3456
	host: "contacts-api-g59t.onrender.com", 
	basePath: "/",
    // Update based on environment for testing
    // Production: https:  || Development: http
	schemes: ["https"],
	consumes: ["application/json"],
	produces: ["application/json"],
	tags: [
		{
			name: "Contacts",
			description: "Create, read, update, and delete contact records",
		},
	],
	securityDefinitions: {},
	definitions: {
		Contact: {
			firstName: "Jane",
			lastName: "Doe",
			email: "jane@example.com",
			favoriteColor: "Blue",
			birthday: "1998-04-20",
		},
	},
};

const outputFile = "./swagger.json";
const routes = ["./app.js"];

swaggerAutogen(outputFile, routes, document);


// run "npm run swagger" command in console
// run this again when switching between production and development