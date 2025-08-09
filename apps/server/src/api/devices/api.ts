import { Hono } from "hono";
import { resolver } from "hono-openapi/zod";
import { z } from "zod";

import { describeRoute } from "@/utils/route";

import { DeviceSavingSchema, DeviceSchema } from "./schema";
import { getAllDevices, getDeviceById, getSavingsByDeviceId } from "./service";

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

devicesRouter.get(
	"/:deviceId/savings",
	describeRoute({
		tags: ["Device Savings"],
		summary: "Get savings by device ID",
		description: "Retrieve all saving records for a specific device",
		parameters: [
			{
				in: "query",
				name: "startDate",
				schema: { type: "string", format: "date-time" },
				required: false,
				description: "Filter savings from this date (ISO format)",
			},
			{
				in: "query",
				name: "endDate",
				schema: { type: "string", format: "date-time" },
				required: false,
				description: "Filter savings until this date (ISO format)",
			},
		],
		responses: {
			200: {
				description: "List of device saving records for the device",
				content: {
					"application/json": {
						schema: resolver(z.array(DeviceSavingSchema)),
					},
				},
			},
		},
		includeCommonErrors: ["400", "404"],
	}),
	async (c) => {
		const deviceId = Number(c.req.param("deviceId"));
		const startDate = c.req.query("startDate");
		const endDate = c.req.query("endDate");
		const savings = await getSavingsByDeviceId(deviceId, startDate, endDate);
		return c.json(savings);
	},
);
