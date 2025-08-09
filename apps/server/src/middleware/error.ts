import type { ErrorHandler } from "hono";

import { HTTPException } from "hono/http-exception";

export const errorHandler: ErrorHandler = (err, c) => {
	const timestamp = new Date().toISOString();

	if (err instanceof HTTPException) {
		return c.json(
			{
				error: err.message,
				status: err.status,
				timestamp,
			},
			err.status,
		);
	}

	console.error("Unhandled error:", err);

	return c.json(
		{
			error: "Internal Server Error",
			status: 500,
			timestamp,
		},
		500,
	);
};
