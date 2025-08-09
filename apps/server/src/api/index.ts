import { Hono } from "hono";
import { resolver } from "hono-openapi/zod";
import { z } from "zod";

import { config } from "@/config";
import { describeRoute } from "@/utils/route";

const StatusResponse = z.object({
	version: z.string(),
	message: z.string(),
	title: z.string(),
});

export const baseRouter = new Hono();

baseRouter.get(
	"/",
	describeRoute({
		tags: ["Status"],
		summary: "Get server status",
		description: "Returns the current server status and version information",
		responses: {
			200: {
				description: "Server status information",
				content: {
					"application/json": {
						schema: resolver(StatusResponse),
						example: {
							version: "1.0.0",
							title: "AMPD Server",
							message: "Server is running",
						},
					},
				},
			},
		},
	}),
	(c) => {
		return c.json({
			version: config.version,
			title: config.title,
			message: "Server is running",
		});
	},
);
