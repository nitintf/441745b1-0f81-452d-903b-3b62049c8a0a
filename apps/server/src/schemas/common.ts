import type { DescribeRouteOptions } from "hono-openapi";

import { resolver } from "hono-openapi/zod";
import { z } from "zod";

export const ErrorResponse = z.object({
	error: z.string(),
	status: z.number(),
	timestamp: z.string().optional(),
});

export const ValidationErrorResponse = z.object({
	error: z.string(),
	status: z.number(),
	details: z.array(z.string()).optional(),
	timestamp: z.string().optional(),
});

export const commonErrorResponses: NonNullable<
	DescribeRouteOptions["responses"]
> = {
	400: {
		description: "Bad Request - Invalid input data",
		content: {
			"application/json": {
				schema: resolver(ValidationErrorResponse),
				example: {
					error: "Validation failed",
					status: 400,
					details: ['Field "name" is required'],
					timestamp: "2024-01-01T00:00:00Z",
				},
			},
		},
	},
	404: {
		description: "Not Found - Resource not found",
		content: {
			"application/json": {
				schema: resolver(ErrorResponse),
				example: {
					error: "Resource not found",
					status: 404,
					timestamp: "2024-01-01T00:00:00Z",
				},
			},
		},
	},
	500: {
		description: "Internal Server Error",
		content: {
			"application/json": {
				schema: resolver(ErrorResponse),
				example: {
					error: "Internal server error",
					status: 500,
					timestamp: "2024-01-01T00:00:00Z",
				},
			},
		},
	},
};
