import { Hono } from "hono";
import { resolver } from "hono-openapi/zod";
import { z } from "zod";

import { describeRoute } from "@/utils/route";

import { CreateDeviceSchema, DeviceSchema, UpdateDeviceSchema } from "./schema";
import {
	createDevice,
	deleteDevice,
	getAllDevices,
	getDeviceById,
	updateDevice,
} from "./service";

export const devicesRouter = new Hono();

devicesRouter.get(
	"/",
	describeRoute({
		tags: ["Devices"],
		summary: "Get all devices",
		description: "Retrieve a list of all devices",
		responses: {
			200: {
				description: "List of devices",
				content: {
					"application/json": {
						schema: resolver(z.array(DeviceSchema)),
					},
				},
			},
		},
	}),
	async (c) => {
		const devices = await getAllDevices();
		return c.json(devices);
	},
);

devicesRouter.get(
	"/:id",
	describeRoute({
		tags: ["Devices"],
		summary: "Get device by ID",
		description: "Retrieve a specific device by its ID",
		responses: {
			200: {
				description: "Device details",
				content: {
					"application/json": {
						schema: resolver(DeviceSchema),
					},
				},
			},
		},
		includeCommonErrors: ["400", "404"],
	}),
	async (c) => {
		try {
			const id = Number(c.req.param("id"));
			const device = await getDeviceById(id);
			return c.json(device);
		} catch (error) {
			return c.json({ error: (error as Error).message }, 404);
		}
	},
);

devicesRouter.post(
	"/",
	describeRoute({
		tags: ["Devices"],
		summary: "Create a new device",
		description: "Create a new device with name and timezone",
		responses: {
			201: {
				description: "Device created successfully",
				content: {
					"application/json": {
						schema: resolver(DeviceSchema),
					},
				},
			},
		},
		includeCommonErrors: ["400"],
	}),
	async (c) => {
		try {
			const body = await c.req.json();
			const data = CreateDeviceSchema.parse(body);
			const device = await createDevice(data);
			return c.json(device, 201);
		} catch (error) {
			return c.json({ error: (error as Error).message }, 400);
		}
	},
);

devicesRouter.put(
	"/:id",
	describeRoute({
		tags: ["Devices"],
		summary: "Update device",
		description: "Update an existing device",
		responses: {
			200: {
				description: "Device updated successfully",
				content: {
					"application/json": {
						schema: resolver(DeviceSchema),
					},
				},
			},
		},
		includeCommonErrors: ["400", "404"],
	}),
	async (c) => {
		try {
			const id = Number(c.req.param("id"));
			const body = await c.req.json();
			const data = UpdateDeviceSchema.parse(body);
			const device = await updateDevice(id, data);
			return c.json(device);
		} catch (error) {
			return c.json({ error: (error as Error).message }, 404);
		}
	},
);

devicesRouter.delete(
	"/:id",
	describeRoute({
		tags: ["Devices"],
		summary: "Delete device",
		description: "Delete an existing device",
		responses: {
			200: {
				description: "Device deleted successfully",
				content: {
					"application/json": {
						schema: resolver(DeviceSchema),
					},
				},
			},
		},
		includeCommonErrors: ["400", "404"],
	}),
	async (c) => {
		try {
			const id = Number(c.req.param("id"));
			const device = await deleteDevice(id);
			return c.json(device);
		} catch (error) {
			return c.json({ error: (error as Error).message }, 404);
		}
	},
);
