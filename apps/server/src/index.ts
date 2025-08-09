import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { baseRouter } from "@/api";
import { config } from "@/config";
import { errorHandler } from "@/middleware/error";
import { setupOpenAPI } from "@/openapi";

const app = new Hono();

app.use(logger());
app.use(
	"/*",
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	}),
);

app.onError(errorHandler);

app.route("/", baseRouter);

setupOpenAPI(app);

serve(
	{
		fetch: app.fetch,
		port: config.env.PORT,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
