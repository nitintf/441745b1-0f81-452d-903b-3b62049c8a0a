import { eq } from "drizzle-orm";

import { db } from "@/db";
import { devices } from "@/db/schema";

export async function dbFindAllDevices() {
	return await db.select().from(devices);
}

export async function dbFindDeviceById(id: number) {
	const [device] = await db.select().from(devices).where(eq(devices.id, id));
	return device;
}

export async function dbCreateDevice(data: typeof devices.$inferInsert) {
	const [device] = await db.insert(devices).values(data).returning();
	return device;
}

export async function dbUpdateDevice(
	id: number,
	data: Partial<typeof devices.$inferInsert>,
) {
	const [device] = await db
		.update(devices)
		.set(data)
		.where(eq(devices.id, id))
		.returning();
	return device;
}

export async function dbDeleteDevice(id: number) {
	const [device] = await db
		.delete(devices)
		.where(eq(devices.id, id))
		.returning();
	return device;
}
