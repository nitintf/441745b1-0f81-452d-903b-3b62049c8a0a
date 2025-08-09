import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { describeRoute } from "@/utils/route";

import {
	GetAllDevicesOpenAPISchema,
	GetDeviceByIdOpenAPISchema,
	GetSavingsByDeviceIdOpenAPISchema,
} from "./openapi";
import { SavingsQuerySchema } from "./schema";
import { getAllDevices, getDeviceById, getSavingsByDeviceId } from "./service";

export const devicesRouter = new Hono();

devicesRouter.get("/", describeRoute(GetAllDevicesOpenAPISchema), async (c) => {
	const devices = await getAllDevices();
	return c.json(devices);
});

devicesRouter.get(
	"/:id",
	describeRoute(GetDeviceByIdOpenAPISchema),
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
	describeRoute(GetSavingsByDeviceIdOpenAPISchema),
	zValidator("query", SavingsQuerySchema),
	async (c) => {
		const deviceId = Number(c.req.param("deviceId"));
		const validated = c.req.valid("query");
		const savings = await getSavingsByDeviceId(
			deviceId,
			validated.startDate,
			validated.endDate,
		);
		return c.json(savings);
	},
);
