import session from "express-session";
import MongoStore from "connect-mongo";
import { config } from "../../config.js";

//connect-mongo manages the sessions collection for you,
//there is no need to create a database to store sessions
const sessionMiddleware = session({
	secret: config.sessionSecret,
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({
		mongoUrl: config.database.url,
		collectionName: "sessions",
		ttl: 60 * 60,
	}),
	cookie: {
		path: "/",
		httpOnly: true,
		secure: config.isProduction,
		sameSite: "lax",
		maxAge: 1000 * 60 * 60,
	},
});

export default sessionMiddleware;
