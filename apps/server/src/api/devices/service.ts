import type { CreateDevice, UpdateDevice } from "./schema";

import {
	dbCreateDevice,
	dbDeleteDevice,
	dbFindAllDevices,
	dbFindDeviceById,
	dbUpdateDevice,
} from "./repository";

export async function getAllDevices() {
	return await dbFindAllDevices();
}

export async function getDeviceById(id: number) {
	const device = await dbFindDeviceById(id);
	if (!device) {
		throw new Error("Device not found");
	}
	return device;
}

export async function createDevice(data: CreateDevice) {
	return await dbCreateDevice(data);
}

export async function updateDevice(id: number, data: UpdateDevice) {
	const device = await dbFindDeviceById(id);
	if (!device) {
		throw new Error("Device not found");
	}
	return await dbUpdateDevice(id, data);
}

export async function deleteDevice(id: number) {
	const device = await dbFindDeviceById(id);
	if (!device) {
		throw new Error("Device not found");
	}
	return await dbDeleteDevice(id);
}
