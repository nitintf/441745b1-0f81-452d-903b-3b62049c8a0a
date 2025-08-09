import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";

import { reset } from "drizzle-seed";

import { db } from "../src/db/index";
import * as schema from "../src/db/schema";

async function main() {
	await reset(db as unknown as BaseSQLiteDatabase<"async", unknown>, schema);
	console.log("Database reset successfully.");
}

main().catch(console.error);
