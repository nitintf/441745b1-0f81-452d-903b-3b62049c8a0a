import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { deviceSaving } from "@/db/schema";

export async function dbFindAllDeviceSavings() {
	return await db
		.select()
		.from(deviceSaving)
		.orderBy(desc(deviceSaving.timestamp));
}

export async function dbFindDeviceSavingsByDeviceId(deviceId: number) {
	return await db
		.select()
		.from(deviceSaving)
		.where(eq(deviceSaving.deviceId, deviceId))
		.orderBy(desc(deviceSaving.timestamp));
}

export async function dbFindDeviceSavingById(id: number) {
	const [record] = await db
		.select()
		.from(deviceSaving)
		.where(eq(deviceSaving.id, id));
	return record;
}

export async function dbFindDeviceSavingsByDateRange(
	deviceId: number,
	startDate: string,
	endDate: string,
) {
	return await db
		.select()
		.from(deviceSaving)
		.where(
			and(
				eq(deviceSaving.deviceId, deviceId),
				// Add date range filtering here based on your date format
			),
		)
		.orderBy(desc(deviceSaving.timestamp));
}

export async function dbCreateDeviceSaving(
	data: typeof deviceSaving.$inferInsert,
) {
	const [record] = await db.insert(deviceSaving).values(data).returning();
	return record;
}

export async function dbUpdateDeviceSaving(
	id: number,
	data: Partial<typeof deviceSaving.$inferInsert>,
) {
	const [record] = await db
		.update(deviceSaving)
		.set(data)
		.where(eq(deviceSaving.id, id))
		.returning();
	return record;
}

export async function dbDeleteDeviceSaving(id: number) {
	const [record] = await db
		.delete(deviceSaving)
		.where(eq(deviceSaving.id, id))
		.returning();
	return record;
}
