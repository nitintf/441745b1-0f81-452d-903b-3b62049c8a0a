import { isAfter, isValid, parseISO } from "date-fns";
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
	const parsedStartDate = startDate ? parseISO(startDate) : undefined;
	const parsedEndDate = endDate ? parseISO(endDate) : undefined;

	if (startDate && !isValid(parsedStartDate)) {
		throw new HTTPException(400, {
			message: "Invalid startDate format. Please use ISO 8601 format (YYYY-MM-DD)",
		});
	}

	if (endDate && !isValid(parsedEndDate)) {
		throw new HTTPException(400, {
			message: "Invalid endDate format. Please use ISO 8601 format (YYYY-MM-DD)",
		});
	}

	if (
		parsedStartDate &&
		parsedEndDate &&
		isAfter(parsedStartDate, parsedEndDate)
	) {
		throw new HTTPException(400, {
			message: "startDate cannot be after endDate",
		});
	}

	return await dbFindDeviceSavingsByDeviceId(deviceId, startDate, endDate);
}
