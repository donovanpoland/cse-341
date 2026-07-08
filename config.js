const {
	APP_NAME,
	// local dev
	NODE_ENV,
	HOST,
	PORT,
	// Database
	DB_SCHEME,
	DB_USER,
	DB_PASSWORD,
	DB_HOST,
	DB_CLUSTER,
	DB_LOOKUP,
	DB_NAME,
	DB_OPTIONS = null,
	//sessions
	SESSION_SECRET,
	TRUST_PROXY_HOPS,
} = process.env;

// Per MongoDB Docs all options must be URL-encoded to accept special characters
// This must also be done to the password, user, cluster name and database name
// to ensure special characters do not interrupt the URI flow
const safeUser = encodeURIComponent(DB_USER || "");
const safeName = encodeURIComponent(DB_NAME || "");
const safePassword = encodeURIComponent(DB_PASSWORD || "");
const safeCluster = encodeURIComponent(DB_CLUSTER || "");

// set environment to production or development to enable specific features
const nodeEnv = NODE_ENV?.trim() || "development";
const isProduction = nodeEnv === "production";
const isDevelopment = nodeEnv === "development";

// set server settings
const host = HOST?.trim() || (isProduction ? "0.0.0.0" : "127.0.0.1");
const port = parseInt(PORT || "3000", 10);
const trustProxyHops = parseInt(
	TRUST_PROXY_HOPS || (isProduction ? "1" : "0"),
	10,
);

// build cluster components
const dbHost = `${safeCluster}.${DB_LOOKUP}.${DB_HOST}`;
const dbPath = safeName ? `/${safeName}` : "";

// Build the base URL depending on whether a username/password exists
let mongoUri = "";

// Example uri = <scheme>://<user_name>:<db_password>@<app_name>.<db_lookup>.<host_name>/?<options>
if (safeUser && safePassword) {
	mongoUri =
		`${DB_SCHEME}://${safeUser}:${safePassword}@${dbHost}${dbPath}`.trim();
} else {
	mongoUri = `${DB_SCHEME}://${dbHost}${dbPath}`.trim();
}

// Append query options if they exist
if (DB_OPTIONS) {
	mongoUri += `?${DB_OPTIONS}`;
}

//session secret
// express session has a fall back session secret if not present,
// ensure fallback is not used by ensuring one is provided to environment
// use a different secret per environment
if (!SESSION_SECRET?.trim()) {
	throw new Error(
		"Missing SESSION_SECRET. Add it to your environment before starting the app.",
	);
}

export const config = {
	name: APP_NAME?.trim() || "Site Name",
	isProduction,
	isDevelopment,
	sessionSecret: SESSION_SECRET.trim(),
	server: {
		host,
		port,
		trustProxyHops,
	},
	database: {
		url: mongoUri,
	},
};
