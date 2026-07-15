// express
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

//swagger
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };


//routes
import router from "./src/routes/routes.js";

//sessions
import sessionMiddleware from "./src/config/session.js";

//middleware
import flash from "./src/middleware/flashMiddleware.js";

//config
import { config } from "./config.js";

//errors
import { notFound, errorHandler } from "./src/middleware/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Allow Express to receive and process common POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));
// Tell Express where to find your templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Sessions
if (config.server.trustProxyHops > 0) {
	app.set("trust proxy", config.server.trustProxyHops);
}
app.use(sessionMiddleware);

// Set app locals
app.locals.siteName = config.name;
app.locals.isDevelopment = config.isDevelopment;
// set is logged in status as a local variable
app.use((req, res, next) => {
	res.locals.isLoggedIn = Boolean(req.session?.user);
	res.locals.user = req.session?.user ?? null;
	next();
});

// Middleware
// set flash middleware
app.use(flash);
//  Log all incoming requests
app.use((req, res, next) => {
	const isDevelopment = config.isDevelopment;
	if (isDevelopment) {
		res.on("finish", () => {
			console.log(`Method: ${req.method}\nURL: ${req.url}\nStatus: ${res.statusCode}
			`);
		});
	}
	// Pass control to the next middleware or route
	next();
});

// Routes - Use the imported router to handle routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router);

// errors middleware
app.use(notFound);
app.use(errorHandler);

// exports
export default app;
