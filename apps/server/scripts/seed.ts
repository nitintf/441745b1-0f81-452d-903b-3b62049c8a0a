import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";

import csv from "csv-parser";
import { count } from "drizzle-orm";

import { db } from "../src/db";
import * as schema from "../src/db/schema";

const BATCH_SIZE = 100;

const main = async () => {
	const csvDevicesPath = join(process.cwd(), "data", "devices.csv");
	const csvSavingPath = join(process.cwd(), "data", "device-saving.csv");

	if (existsSync(csvDevicesPath) && existsSync(csvSavingPath)) {
		await importFromCSV();
	}
};

async function importFromCSV() {
	const parseCSV = async (filePath: string) => {
		const results: any[] = [];
		return new Promise<any[]>((resolve, reject) => {
			createReadStream(filePath)
				.pipe(csv())
				.on("data", (data) => results.push(data))
				.on("end", () => resolve(results))
				.on("error", (error) => reject(error));
		});
	};

	const [devicesCount] = await db
		.select({ count: count() })
		.from(schema.devices);

	if (devicesCount.count === 0) {
		const devicesPath = join(process.cwd(), "data", "devices.csv");
		const devicesRows = await parseCSV(devicesPath);

		const devicesData = devicesRows.map((row) => ({
			id: Number.parseInt(row.id),
			name: row.name,
			timezone: row.timezone,
		}));

		await db.insert(schema.devices).values(devicesData);
		console.log(`Imported ${devicesData.length} devices from CSV`);
	}

	const [savingsCount] = await db
		.select({ count: count() })
		.from(schema.deviceSaving);

	if (savingsCount.count === 0) {
		const savingPath = join(process.cwd(), "data", "device-saving.csv");
		const savingRows = await parseCSV(savingPath);

		const savingData = savingRows.map((row) => ({
			deviceId: Number.parseInt(row.device_id),
			timestamp: row.timestamp,
			deviceTimestamp: row.device_timestamp,
			carbonSaved: Number.parseFloat(row.carbon_saved),
			fuelSaved: Number.parseFloat(row.fueld_saved),
		}));

		for (let i = 0; i < savingData.length; i += BATCH_SIZE) {
			const batch = savingData.slice(i, i + BATCH_SIZE);
			await db.insert(schema.deviceSaving).values(batch);
			console.log(
				`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(savingData.length / BATCH_SIZE)}`,
			);
		}

		console.log(`Imported ${savingData.length} device saving records from CSV`);
	}
}

main()
	.then(() => {
		console.log("Seeding completed successfully");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Error seeding database:", error);
		process.exit(1);
	});
