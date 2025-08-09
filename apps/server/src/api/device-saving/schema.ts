import { z } from "zod";

export const DeviceSavingSchema = z.object({
	id: z.number(),
	deviceId: z.number(),
	timestamp: z.string(),
	deviceTimestamp: z.string(),
	carbonSaved: z.number(),
	fuelSaved: z.number(),
});

export const CreateDeviceSavingSchema = z.object({
	deviceId: z.number(),
	timestamp: z.string(),
	deviceTimestamp: z.string(),
	carbonSaved: z.number().min(0),
	fuelSaved: z.number().min(0),
});

export const UpdateDeviceSavingSchema = z.object({
	timestamp: z.string().optional(),
	deviceTimestamp: z.string().optional(),
	carbonSaved: z.number().min(0).optional(),
	fuelSaved: z.number().min(0).optional(),
});

export const TotalSavingsSchema = z.object({
	deviceId: z.number(),
	totalCarbonSaved: z.number(),
	totalFuelSaved: z.number(),
	recordCount: z.number(),
});

export type DeviceSaving = z.infer<typeof DeviceSavingSchema>;
export type CreateDeviceSaving = z.infer<typeof CreateDeviceSavingSchema>;
export type UpdateDeviceSaving = z.infer<typeof UpdateDeviceSavingSchema>;
export type TotalSavings = z.infer<typeof TotalSavingsSchema>;
