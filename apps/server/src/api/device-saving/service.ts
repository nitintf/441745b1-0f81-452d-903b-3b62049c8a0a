import type { CreateDeviceSaving, UpdateDeviceSaving } from "./schema";

import {
	dbCreateDeviceSaving,
	dbDeleteDeviceSaving,
	dbFindAllDeviceSavings,
	dbFindDeviceSavingById,
	dbFindDeviceSavingsByDateRange,
	dbFindDeviceSavingsByDeviceId,
	dbUpdateDeviceSaving,
} from "./repository";

export async function getAllSavings() {
	return await dbFindAllDeviceSavings();
}

export async function getSavingsById(id: number) {
	const record = await dbFindDeviceSavingById(id);
	if (!record) {
		throw new Error("Device saving record not found");
	}
	return record;
}

export async function getSavingsByDeviceId(deviceId: number) {
	return await dbFindDeviceSavingsByDeviceId(deviceId);
}

export async function getSavingsByDateRange(
	deviceId: number,
	startDate: string,
	endDate: string,
) {
	return await dbFindDeviceSavingsByDateRange(deviceId, startDate, endDate);
}

export async function createSaving(data: CreateDeviceSaving) {
	return await dbCreateDeviceSaving(data);
}

export async function updateSaving(id: number, data: UpdateDeviceSaving) {
	const record = await dbFindDeviceSavingById(id);
	if (!record) {
		throw new Error("Device saving record not found");
	}
	return await dbUpdateDeviceSaving(id, data);
}

export async function deleteSaving(id: number) {
	const record = await dbFindDeviceSavingById(id);
	if (!record) {
		throw new Error("Device saving record not found");
	}
	return await dbDeleteDeviceSaving(id);
}

export async function calculateTotalSavings(deviceId: number) {
	const savings = await dbFindDeviceSavingsByDeviceId(deviceId);

	const totalCarbon = savings.reduce(
		(sum, record) => sum + record.carbonSaved,
		0,
	);
	const totalFuel = savings.reduce((sum, record) => sum + record.fuelSaved, 0);

	return {
		deviceId,
		totalCarbonSaved: totalCarbon,
		totalFuelSaved: totalFuel,
		recordCount: savings.length,
	};
}
