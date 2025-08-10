import { z } from "zod";

export const deviceSchema = z.object({
	id: z.number(),
	name: z.string(),
	timezone: z.string(),
});

export const deviceSavingSchema = z.object({
	id: z.number(),
	deviceId: z.number(),
	timestamp: z.string(),
	deviceTimestamp: z.string(),
	carbonSaved: z.number(),
	fuelSaved: z.number(),
});

export const savingsQuerySchema = z.object({
	startDate: z
		.string()
		.optional()
		.describe("Filter savings from this date (ISO format)"),
	endDate: z
		.string()
		.optional()
		.describe("Filter savings until this date (ISO format)"),
});

export const savingsParamSchema = z.object({
	deviceId: z.string().transform(Number),
});

export type Device = z.infer<typeof deviceSchema>;
export type DeviceSaving = z.infer<typeof deviceSavingSchema>;
export type SavingsQuery = z.infer<typeof savingsQuerySchema>;
export type SavingsParam = z.infer<typeof savingsParamSchema>;
