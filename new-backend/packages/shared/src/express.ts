import cors from "cors";
import express from "express";
import pinoHttp from "pino-http";
import { randomUUID } from "node:crypto";
import type { IncomingMessage } from "node:http";
import type { NextFunction, Request, Response } from "express";
import { env } from "./env";
import { errorHandler } from "./errors";
import { logger } from "./logger";
import { success } from "./response";
import type { AuthenticatedRequest } from "./types";

export const buildBaseApp = (serviceName: string) => {
  const app = express();

  app.disable("x-powered-by");
  app.use(
    cors({
      origin: env.CORS_ORIGINS.split(",").map((item) => item.trim()),
      credentials: true,
    }),
  );
  app.use(
    express.json({
      limit: "2mb",
      verify: (req, _res, buffer) => {
        (req as IncomingMessage & { rawBody?: string }).rawBody = buffer.toString("utf8");
      },
    }),
  );
  app.use(
    pinoHttp({
      logger,
      customProps: () => ({ serviceName }),
      genReqId: (req, res) => {
        const existing = req.headers["x-request-id"];
        const requestId = typeof existing === "string" ? existing : randomUUID();
        res.setHeader("x-request-id", requestId);
        return requestId;
      },
    }),
  );
  app.use((req: Request, _res: Response, next: NextFunction) => {
    (req as AuthenticatedRequest).requestId = String(req.id);
    next();
  });

  app.get("/health", (_req, res) =>
    success(res, { service: serviceName, status: "ok" }, `${serviceName} healthy`),
  );

  return app;
};

export const attachErrorHandler = (app: express.Express) => {
  app.use(errorHandler);
};
