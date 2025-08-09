import { and, desc, eq, gte, lte } from "drizzle-orm";

import { db } from "@/db";
import { deviceSaving, devices } from "@/db/schema";

export async function dbFindAllDevices() {
	return await db.select().from(devices);
}

export async function dbFindDeviceById(id: number) {
	const [device] = await db.select().from(devices).where(eq(devices.id, id));
	return device;
}

export async function dbFindDeviceSavingsByDeviceId(
	deviceId: number,
	startDate?: string,
	endDate?: string,
) {
	const conditions = [eq(deviceSaving.deviceId, deviceId)];

	if (startDate) {
		conditions.push(gte(deviceSaving.timestamp, startDate));
	}

	if (endDate) {
		conditions.push(lte(deviceSaving.timestamp, endDate));
	}

	return await db
		.select()
		.from(deviceSaving)
		.where(and(...conditions))
		.orderBy(desc(deviceSaving.timestamp));
}
