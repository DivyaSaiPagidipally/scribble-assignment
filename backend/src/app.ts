import cors from "cors";
import express from "express";
import { z } from "zod";
import { createApiRouter, errorHandler, notFoundHandler } from "./api/router.js";

const healthResponse = z.object({ status: z.literal("ok") }).parse({ status: "ok" });

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.json(healthResponse);
  });

  app.use(createApiRouter());
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
