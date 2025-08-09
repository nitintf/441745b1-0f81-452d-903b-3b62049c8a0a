import { z } from "zod";

export const DeviceSchema = z.object({
	id: z.number(),
	name: z.string(),
	timezone: z.string(),
});

export const CreateDeviceSchema = z.object({
	name: z.string().min(1, "Name is required"),
	timezone: z.string().min(1, "Timezone is required"),
});

export const UpdateDeviceSchema = z.object({
	name: z.string().min(1).optional(),
	timezone: z.string().min(1).optional(),
});

export type Device = z.infer<typeof DeviceSchema>;
export type CreateDevice = z.infer<typeof CreateDeviceSchema>;
export type UpdateDevice = z.infer<typeof UpdateDeviceSchema>;
