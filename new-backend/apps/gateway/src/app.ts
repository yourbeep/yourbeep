import expressRateLimit from "express-rate-limit";
import type { Request, Response } from "express";
import {
  AppError,
  authenticateFirebaseToken,
  attachErrorHandler,
  buildBaseApp,
  env,
  failure,
  httpJson,
  success,
} from "@yourbeep/shared";
import type { AuthContext } from "@yourbeep/shared";
import { buildOpenApiSpec, renderSwaggerHtml } from "./openapi";

const getRequestPath = (req: Request) => req.originalUrl.split("?")[0] ?? req.originalUrl;
const getRequestQuery = (req: Request) => (req.originalUrl.includes("?") ? `?${req.originalUrl.split("?")[1]}` : "");

const publicRouteMatchers = [
  { method: "POST", pattern: /^\/v1\/auth\/sync$/ },
  { method: "POST", pattern: /^\/v1\/get-in-touch$/ },
  { method: "GET", pattern: /^\/v1\/platform\/settings$/ },
  { method: "GET", pattern: /^\/v1\/platform\/legal\// },
  { method: "GET", pattern: /^\/v1\/testimonials(?:\/)?$/ },
  { method: "GET", pattern: /^\/v1\/courses(?:\/[^/]+(?:\/price(?:\/[^/]+)?)?)?$/ },
  { method: "GET", pattern: /^\/v1\/admin\/bunny\/health$/ },
  { method: "POST", pattern: /^\/v1\/webhooks\// },
];

const isPublicRoute = (req: Request) =>
  publicRouteMatchers.some(
    (matcher) =>
      matcher.method === req.method && matcher.pattern.test(getRequestPath(req)),
  );

const isAuthSyncRoute = (req: Request) =>
  req.method === "POST" && /^\/v1\/auth\/sync$/.test(getRequestPath(req));

const resolveTarget = (path: string) => {
  if (/^\/v1\/courses\/[^/]+\/price(?:\/[^/]+)?$/.test(path)) {
    return env.COMMERCE_URL;
  }

  if (
    /^\/v1\/(auth|users|notifications|tickets|get-in-touch|platform|testimonials)\b/.test(
      path,
    )
  ) {
    return env.IDENTITY_URL;
  }

  if (/^\/v1\/admin\b/.test(path)) {
    if (
      /^\/v1\/admin\/(users|notifications|dashboard|tickets|get-in-touch|platform|testimonials)\b/.test(
        path,
      )
    ) {
      return env.IDENTITY_URL;
    }

    if (/^\/v1\/admin\/commerce\b/.test(path)) {
      return env.COMMERCE_URL;
    }

    return env.CONTENT_URL;
  }

  if (
    /^\/v1\/(courses|games|master-course|submissions|content|webhooks\/bunny)\b/.test(
      path,
    )
  ) {
    return env.CONTENT_URL;
  }

  if (/^\/v1\/(commerce|webhooks\/stripe)\b/.test(path)) {
    return env.COMMERCE_URL;
  }

  return null;
};

const proxyRequest = async (req: Request, res: Response) => {
  const requestPath = getRequestPath(req);
  const target = resolveTarget(requestPath);

  if (!target) {
    return failure(res, 404, "NOT_FOUND", "No route configured for this path");
  }

  const url = `${target}${requestPath.replace(/^\/v1/, "")}${getRequestQuery(req)}`;
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (
      typeof value === "string" &&
      key !== "host" &&
      key !== "content-length"
    ) {
      headers.set(key, value);
    }
  }

  headers.set("x-request-id", String(req.id));

  const auth = req.auth ?? null;
  if (auth) {
    headers.set("x-user-id", auth.id);
    headers.set("x-user-email", auth.email);
    headers.set("x-user-role", auth.role);
    headers.set("x-firebase-uid", auth.firebaseUid);
  }

  const requestBody = ["GET", "HEAD"].includes(req.method)
    ? undefined
    : (req.rawBody ??
      (req.body !== undefined ? JSON.stringify(req.body) : undefined));

  const upstream = await fetch(url, {
    method: req.method,
    headers,
    body: requestBody,
  });

  res.status(upstream.status);

  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "transfer-encoding") {
      res.setHeader(key, value);
    }
  });

  const text = await upstream.text();
  return res.send(text);
};

const hydrateGatewayAuthContext = async (
  req: Request,
): Promise<AuthContext> => {
  const firebaseAuth = await authenticateFirebaseToken(req);

  if (isAuthSyncRoute(req)) {
    req.auth = firebaseAuth;
    return firebaseAuth;
  }

  const response = await httpJson<{
    success: boolean;
    data: {
      user: {
        _id?: string;
        id?: string;
        email: string;
        firebaseUid: string;
        role: "user" | "admin";
      };
    };
  }>(
    `${env.IDENTITY_URL}/internal/users/firebase/${firebaseAuth.firebaseUid}`,
    {
      method: "GET",
      headers: {
        "x-internal-service-key": env.INTERNAL_SERVICE_SECRET,
      },
    },
  );

  const user = response.data.user;
  const auth: AuthContext = {
    id: user._id ?? user.id ?? firebaseAuth.firebaseUid,
    email: user.email,
    firebaseUid: user.firebaseUid,
    role: user.role ?? "user",
  };

  req.auth = auth;
  return auth;
};

export const createGatewayApp = () => {
  const app = buildBaseApp("api-gateway");

  app.use(
    expressRateLimit({
      windowMs: 60_000,
      limit: 200,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (_req, res) =>
        failure(res, 429, "TOO_MANY_REQUESTS", "Rate limit exceeded"),
    }),
  );

  app.get("/", (_req, res) =>
    success(res, { service: "api-gateway", version: "0.1.0" }, "Gateway ready"),
  );

  app.get("/openapi.json", (_req, res) => {
    res.setHeader("content-type", "application/json; charset=utf-8");
    return res.send(JSON.stringify(buildOpenApiSpec(), null, 2));
  });

  app.get("/docs", (_req, res) => {
    res.setHeader("content-type", "text/html; charset=utf-8");
    return res.send(renderSwaggerHtml());
  });

  app.use("/v1", async (req, _res, next) => {
    try {
      const hasBearerToken = typeof req.headers.authorization === "string";

      if (!isPublicRoute(req) || hasBearerToken) {
        await hydrateGatewayAuthContext(req);
      }

      return next();
    } catch (error) {
      return next(error);
    }
  });

  app.use("/v1", async (req, res, next) => {
    try {
      await proxyRequest(req, res);
    } catch (error) {
      if (error instanceof AppError && error.statusCode >= 500) {
        return next(
          new AppError(
            "Upstream service request failed",
            502,
            "UPSTREAM_REQUEST_FAILED",
          ),
        );
      }
      next(error);
    }
  });

  attachErrorHandler(app);
  return app;
};
