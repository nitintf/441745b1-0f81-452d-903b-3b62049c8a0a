import { HTTPException } from "hono/http-exception";

import {
	dbFindAllDevices,
	dbFindDeviceById,
	dbFindDeviceSavingsByDeviceId,
} from "./repository";

export async function getAllDevices() {
	return await dbFindAllDevices();
}

export async function getDeviceById(id: number) {
	const device = await dbFindDeviceById(id);

	if (!device) {
		throw new HTTPException(404, {
			message: "Device not found",
		});
	}

	return device;
}

export async function getSavingsByDeviceId(
	deviceId: number,
	startDate?: string,
	endDate?: string,
) {
	return await dbFindDeviceSavingsByDeviceId(deviceId, startDate, endDate);
}
