import { Hono } from "hono";
import { resolver } from "hono-openapi/zod";
import { z } from "zod";

import { describeRoute } from "@/utils/route";

import {
	CreateDeviceSavingSchema,
	DeviceSavingSchema,
	TotalSavingsSchema,
	UpdateDeviceSavingSchema,
} from "./schema";
import {
	calculateTotalSavings,
	createSaving,
	deleteSaving,
	getAllSavings,
	getSavingsByDeviceId,
	getSavingsById,
	updateSaving,
} from "./service";

export const deviceSavingRouter = new Hono();

deviceSavingRouter.get(
	"/",
	describeRoute({
		tags: ["Device Savings"],
		summary: "Get all device savings",
		description: "Retrieve a list of all device saving records",
		responses: {
			200: {
				description: "List of device saving records",
				content: {
					"application/json": {
						schema: resolver(z.array(DeviceSavingSchema)),
					},
				},
			},
		},
		includeCommonErrors: ["400"],
	}),
	async (c) => {
		const savings = await getAllSavings();
		return c.json(savings);
	},
);

deviceSavingRouter.get(
	"/:id",
	describeRoute({
		tags: ["Device Savings"],
		summary: "Get device saving by ID",
		description: "Retrieve a specific device saving record by its ID",
		responses: {
			200: {
				description: "Device saving record",
				content: {
					"application/json": {
						schema: resolver(DeviceSavingSchema),
					},
				},
			},
		},
		includeCommonErrors: ["400", "404"],
	}),
	async (c) => {
		try {
			const id = Number(c.req.param("id"));
			const saving = await getSavingsById(id);
			return c.json(saving);
		} catch (error) {
			return c.json({ error: (error as Error).message }, 404);
		}
	},
);

deviceSavingRouter.get(
	"/device/:deviceId",
	describeRoute({
		tags: ["Device Savings"],
		summary: "Get savings by device ID",
		description: "Retrieve all saving records for a specific device",
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
		const savings = await getSavingsByDeviceId(deviceId);
		return c.json(savings);
	},
);

deviceSavingRouter.get(
	"/device/:deviceId/total",
	describeRoute({
		tags: ["Device Savings"],
		summary: "Get total savings for device",
		description: "Calculate total carbon and fuel savings for a device",
		responses: {
			200: {
				description: "Total savings summary for the device",
				content: {
					"application/json": {
						schema: resolver(TotalSavingsSchema),
					},
				},
			},
		},
		includeCommonErrors: ["400", "404"],
	}),
	async (c) => {
		const deviceId = Number(c.req.param("deviceId"));
		const totals = await calculateTotalSavings(deviceId);
		return c.json(totals);
	},
);

deviceSavingRouter.post(
	"/",
	describeRoute({
		tags: ["Device Savings"],
		summary: "Create a new device saving record",
		description: "Create a new device saving record",
		responses: {
			201: {
				description: "Device saving record created successfully",
				content: {
					"application/json": {
						schema: resolver(DeviceSavingSchema),
					},
				},
			},
		},
		includeCommonErrors: ["400"],
	}),
	async (c) => {
		try {
			const body = await c.req.json();
			const data = CreateDeviceSavingSchema.parse(body);
			const saving = await createSaving(data);
			return c.json(saving, 201);
		} catch (error) {
			return c.json({ error: (error as Error).message }, 400);
		}
	},
);

deviceSavingRouter.put(
	"/:id",
	describeRoute({
		tags: ["Device Savings"],
		summary: "Update device saving record",
		description: "Update an existing device saving record",
		responses: {
			200: {
				description: "Device saving record updated successfully",
				content: {
					"application/json": {
						schema: resolver(DeviceSavingSchema),
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
			const data = UpdateDeviceSavingSchema.parse(body);
			const saving = await updateSaving(id, data);
			return c.json(saving);
		} catch (error) {
			return c.json({ error: (error as Error).message }, 404);
		}
	},
);

deviceSavingRouter.delete(
	"/:id",
	describeRoute({
		tags: ["Device Savings"],
		summary: "Delete device saving record",
		description: "Delete an existing device saving record",
		responses: {
			200: {
				description: "Device saving record deleted successfully",
				content: {
					"application/json": {
						schema: resolver(DeviceSavingSchema),
					},
				},
			},
		},
		includeCommonErrors: ["400", "404"],
	}),
	async (c) => {
		try {
			const id = Number(c.req.param("id"));
			const saving = await deleteSaving(id);
			return c.json(saving);
		} catch (error) {
			return c.json({ error: (error as Error).message }, 404);
		}
	},
);
