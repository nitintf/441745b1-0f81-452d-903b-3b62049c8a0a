import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./db",
	dialect: "sqlite",
	dbCredentials: {
		url: "./data/app.db",
	},
});
