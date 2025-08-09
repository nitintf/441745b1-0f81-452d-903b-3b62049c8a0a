import {
	type DescribeRouteOptions,
	describeRoute as honoDescribeRoute,
} from "hono-openapi";

import { commonErrorResponses } from "@/schemas/common";

type CommonErrorCode = "400" | "404" | "500";

interface CustomRouteConfig extends DescribeRouteOptions {
	includeCommonErrors?: CommonErrorCode[];
}

/**
 * Enhanced describeRoute that automatically includes common error responses
 * Always includes 500 error, optionally includes 400, 404 based on includeCommonErrors array
 */
export function describeRoute(config: CustomRouteConfig) {
	const {
		tags,
		summary,
		description,
		responses,
		includeCommonErrors = [],
	} = config;

	const finalResponses = { ...responses };

	if (responses) {
		// Always include 500 error if not already defined
		if (!responses["500"]) {
			finalResponses["500"] = commonErrorResponses["500"];
		}

		// Add other common error responses if specified
		includeCommonErrors.forEach((code) => {
			if (!responses[code] && commonErrorResponses[code]) {
				finalResponses[code] = commonErrorResponses[code];
			}
		});
	}

	return honoDescribeRoute({
		tags,
		summary,
		description,
		responses: finalResponses,
	});
}
