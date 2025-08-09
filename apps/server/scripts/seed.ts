import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

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
	const parseCSV = (content: string) =>
		content
			.trim()
			.split("\n")
			.map((line) => line.split(",").map((cell) => cell.trim()));

	const [devicesCount] = await db
		.select({ count: count() })
		.from(schema.devices);

	if (devicesCount.count === 0) {
		const devicesContent = readFileSync(
			join(process.cwd(), "data", "devices.csv"),
			"utf8",
		);
		const devicesRows = parseCSV(devicesContent);

		const [, ...deviceDataRows] = devicesRows;

		const devicesData = deviceDataRows.map(([id, name, timezone]) => ({
			id: Number.parseInt(id),
			name,
			timezone,
		}));

		await db.insert(schema.devices).values(devicesData);
		console.log(`Imported ${devicesData.length} devices from CSV`);
	}

	const [savingsCount] = await db
		.select({ count: count() })
		.from(schema.deviceSaving);

	if (savingsCount.count === 0) {
		const savingContent = readFileSync(
			join(process.cwd(), "data", "device-saving.csv"),
			"utf8",
		);

		const savingRows = parseCSV(savingContent);
		const [, ...savingDataRows] = savingRows;

		const savingData = savingDataRows.map(
			([deviceId, timestamp, deviceTimestamp, carbonSaved, fuelSaved]) => ({
				deviceId: Number.parseInt(deviceId),
				timestamp,
				deviceTimestamp,
				carbonSaved: Number.parseFloat(carbonSaved),
				fuelSaved: Number.parseFloat(fuelSaved),
			}),
		);

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
