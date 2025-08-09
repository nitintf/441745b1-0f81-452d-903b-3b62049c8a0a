import { z } from "zod";

export const DeviceSchema = z.object({
	id: z.number(),
	name: z.string(),
	timezone: z.string(),
});

export const DeviceSavingSchema = z.object({
	id: z.number(),
	deviceId: z.number(),
	timestamp: z.string(),
	deviceTimestamp: z.string(),
	carbonSaved: z.number(),
	fuelSaved: z.number(),
});

export const SavingsQuerySchema = z.object({
	startDate: z
		.string()
		.optional()
		.describe("Filter savings from this date (ISO format)"),
	endDate: z
		.string()
		.optional()
		.describe("Filter savings until this date (ISO format)"),
});

export type Device = z.infer<typeof DeviceSchema>;
export type DeviceSaving = z.infer<typeof DeviceSavingSchema>;
