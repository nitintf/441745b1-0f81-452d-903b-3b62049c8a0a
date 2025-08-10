import type { Hono } from "hono";

import { Scalar } from "@scalar/hono-api-reference";
import { openAPISpecs } from "hono-openapi";

import { config } from "@/config";

export function setupOpenAPI(app: Hono, prefix = "/openapi") {
	// OpenAPI spec
	app.get(
		`${prefix}/spec`,
		openAPISpecs(app, {
			documentation: {
				info: {
					title: config.title,
					version: config.version,
					description: config.description,
				},
			},
		}),
	);

	// OpenAPI UI with Scalar
	app.get(
		`${prefix}/ui`,
		Scalar({
			theme: "kepler",
			url: `${prefix}/spec`,
		}),
	);
}
