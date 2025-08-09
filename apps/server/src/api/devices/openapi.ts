import type { CustomRouteConfig } from "@/utils/route";

import { resolver } from "hono-openapi/zod";
import { z } from "zod";

import { DeviceSavingSchema, DeviceSchema } from "./schema";

export const GetAllDevicesOpenAPISchema: CustomRouteConfig = {
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
};

export const GetDeviceByIdOpenAPISchema: CustomRouteConfig = {
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
	includeCommonErrors: ["404"],
};

export const GetSavingsByDeviceIdOpenAPISchema: CustomRouteConfig = {
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
	includeCommonErrors: ["400"],
};
