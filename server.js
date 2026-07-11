import { config } from "./config.js";
import app from "./app.js";
import connectDB from "./src/database/mongodb.js";

const HOST = config.server.host;
const PORT = config.server.port;
const isProduction = config.isProduction;
const isDevelopment = config.isDevelopment;

const startServer = async () => {
	try {
		// connect to database
		await connectDB();
		// start server
		// if there is a HOST
		// listen on PORT and HOST and call onListen function
		// else only list on PORT and call onListen function
		const server = HOST
			? app.listen(PORT, HOST, onListen)
			: app.listen(PORT, onListen);
		// nodes event system server.on(event, function)
		server.on("error", onServerError);
	} catch (error) {
		console.error("Startup failed:", error.message);
		//exit
		process.exit(1);
	}
};

const onListen = () => {
	// if there is a HOST
	// location is http string with port
	// else location is only port number
	const location = HOST ? `http://${HOST}:${PORT}` : `port ${PORT}`;

	//log environment and display hosting location
	if (isDevelopment) {
		console.log(`Development mode\nServer listening on ${location}`);
	}

	if (isProduction) {
		console.log(`Production mode\nServer listening on ${location}`);
	}
};

// Check port and host errors
const onServerError = (error) => {
	// port already in use error
	if (error.code === "EADDRINUSE") {
		console.error(`Port ${PORT} is already in use.`);
	}
	// no permission to use that port error
	else if (error.code === "EACCES") {
		console.error(
			`Permission denied for port ${PORT}. Use a port above 1024.`,
		);
	}
	// host or ip not available
	else if (error.code === "EADDRNOTAVAIL") {
		console.error(`Host ${HOST} is not available on this machine.`);
	}
	// failed to start server
	else {
		console.error("Server failed:", error);
	}
	// exit
	process.exit(1);
};

// call server start function
await startServer();
