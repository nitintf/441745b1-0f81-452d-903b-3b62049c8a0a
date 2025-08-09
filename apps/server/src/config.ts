import { readFileSync } from "node:fs";
import { join } from "node:path";

import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	PORT: z.string().transform(Number).default("3001"),
	DATABASE_URL: z.string().optional(),
});

const pkg = JSON.parse(
	readFileSync(join(process.cwd(), "package.json"), "utf8"),
);

console.log(envSchema.parse(process.env));

export const config = {
	env: envSchema.parse(process.env),
	version: pkg.version || "1.0.0",
	title: "AMPD Server",
	description: "AMPD assignment server",
};
