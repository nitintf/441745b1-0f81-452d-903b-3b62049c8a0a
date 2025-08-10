import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { describeRoute } from "@/utils/route";

import {
	getAllDevicesOpenAPISchema,
	getDeviceByIdOpenAPISchema,
	getSavingsByDeviceIdOpenAPISchema,
} from "./openapi";
import {
	type SavingsParam,
	type SavingsQuery,
	savingsParamSchema,
	savingsQuerySchema,
} from "./schema";
import { getAllDevices, getDeviceById, getSavingsByDeviceId } from "./service";

export const devicesRouter = new Hono();

devicesRouter.get("/", describeRoute(getAllDevicesOpenAPISchema), async (c) => {
	const devices = await getAllDevices();
	return c.json(devices);
});

devicesRouter.get(
	"/:id",
	describeRoute(getDeviceByIdOpenAPISchema),
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
	describeRoute(getSavingsByDeviceIdOpenAPISchema),
	zValidator("query", savingsQuerySchema),
	zValidator("param", savingsParamSchema),
	async (c) => {
		const validatedParam = c.req.valid("param") as SavingsParam;
		const validatedQuery = c.req.valid("query") as SavingsQuery;
		const savings = await getSavingsByDeviceId(
			validatedParam.deviceId,
			validatedQuery.startDate,
			validatedQuery.endDate,
		);
		return c.json(savings);
	},
);
