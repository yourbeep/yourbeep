import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.string().default("info"),
  GATEWAY_PORT: z.coerce.number().default(4000),
  IDENTITY_PORT: z.coerce.number().default(4001),
  CONTENT_PORT: z.coerce.number().default(4002),
  COMMERCE_PORT: z.coerce.number().default(4003),
  GATEWAY_URL: z.string().url().default("http://localhost:4000"),
  IDENTITY_URL: z.string().url().default("http://localhost:4001"),
  CONTENT_URL: z.string().url().default("http://localhost:4002"),
  COMMERCE_URL: z.string().url().default("http://localhost:4003"),
  INTERNAL_SERVICE_SECRET: z.string().min(8).default("local-internal-secret"),
  CORS_ORIGINS: z.string().default("http://localhost:3000,http://localhost:5173"),
  MONGODB_URI_IDENTITY: z.string().default("mongodb://127.0.0.1:27017/yourbeep_identity"),
  MONGODB_URI_CONTENT: z.string().default("mongodb://127.0.0.1:27017/yourbeep_content"),
  MONGODB_URI_COMMERCE: z.string().default("mongodb://127.0.0.1:27017/yourbeep_commerce"),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_SERVICE_ACCOUNT_PATH: z.string().optional(),
  ADMIN_EMAIL_ALLOWLIST: z.string().optional(),
  BUNNY_STREAM_API_KEY: z.string().optional(),
  BUNNY_STREAM_LIBRARY_ID: z.string().optional(),
  BUNNY_STREAM_READONLY_API_KEY: z.string().optional(),
  BUNNY_CDN_HOSTNAME: z.string().optional(),
  BUNNY_TOKEN_AUTH_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);
