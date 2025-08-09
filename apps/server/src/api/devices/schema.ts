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

export type Device = z.infer<typeof DeviceSchema>;
export type DeviceSaving = z.infer<typeof DeviceSavingSchema>;
