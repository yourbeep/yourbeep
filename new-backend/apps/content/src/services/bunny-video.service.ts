import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { AppError, env } from "@yourbeep/shared";

const ensureBunnyEnv = () => {
  if (
    !env.BUNNY_STREAM_API_KEY ||
    !env.BUNNY_STREAM_LIBRARY_ID ||
    !env.BUNNY_CDN_HOSTNAME ||
    !env.BUNNY_TOKEN_AUTH_KEY ||
    !env.BUNNY_STREAM_READONLY_API_KEY
  ) {
    throw new AppError("Bunny Stream environment variables are not fully configured", 500, "BUNNY_CONFIG_MISSING");
  }
};

export const createBunnyVideo = async (title: string) => {
  ensureBunnyEnv();

  const response = await fetch(
    `https://video.bunnycdn.com/library/${env.BUNNY_STREAM_LIBRARY_ID}/videos`,
    {
      method: "POST",
      headers: {
        AccessKey: env.BUNNY_STREAM_API_KEY!,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new AppError(`Bunny video creation failed: ${text || response.statusText}`, 500, "UPLOAD_FAILED");
  }

  const data = await response.json() as { guid: string };
  return data;
};

export const deleteBunnyVideo = async (bunnyVideoId: string) => {
  ensureBunnyEnv();

  const response = await fetch(
    `https://video.bunnycdn.com/library/${env.BUNNY_STREAM_LIBRARY_ID}/videos/${bunnyVideoId}`,
    {
      method: "DELETE",
      headers: {
        AccessKey: env.BUNNY_STREAM_API_KEY!,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new AppError(`Bunny video delete failed: ${text || response.statusText}`, 500, "UPLOAD_FAILED");
  }

  return { success: true };
};

export const listBunnyVideos = async () => {
  ensureBunnyEnv();

  const response = await fetch(
    `https://video.bunnycdn.com/library/${env.BUNNY_STREAM_LIBRARY_ID}/videos?page=1&itemsPerPage=1`,
    {
      method: "GET",
      headers: {
        AccessKey: env.BUNNY_STREAM_READONLY_API_KEY!,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new AppError(
      `Bunny video list failed: ${text || response.statusText}`,
      502,
      "BUNNY_LOOKUP_FAILED",
    );
  }

  return (await response.json()) as {
    items?: Array<{ guid?: string; title?: string }>;
    totalItems?: number;
    currentPage?: number;
    itemsPerPage?: number;
  };
};

export const buildBunnyUploadUrl = (bunnyVideoId: string) => {
  ensureBunnyEnv();
  return `https://video.bunnycdn.com/library/${env.BUNNY_STREAM_LIBRARY_ID}/videos/${bunnyVideoId}`;
};

export const buildBunnyThumbnailUrl = (bunnyVideoId: string) => {
  ensureBunnyEnv();
  return `https://${env.BUNNY_CDN_HOSTNAME}/${bunnyVideoId}/thumbnail.jpg`;
};

export const getBunnyVideoDetails = async (bunnyVideoId: string) => {
  ensureBunnyEnv();

  const response = await fetch(
    `https://video.bunnycdn.com/library/${env.BUNNY_STREAM_LIBRARY_ID}/videos/${bunnyVideoId}`,
    {
      method: "GET",
      headers: {
        AccessKey: env.BUNNY_STREAM_READONLY_API_KEY!,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new AppError(
      `Bunny video lookup failed: ${text || response.statusText}`,
      502,
      "BUNNY_LOOKUP_FAILED",
    );
  }

  return (await response.json()) as {
    status?: number;
    length?: number;
    videoLength?: number;
    guid?: string;
  };
};

export const buildSignedBunnyStreamUrl = (bunnyVideoId: string) => {
  ensureBunnyEnv();

  const expires = Math.floor(Date.now() / 1000) + 3600;
  const tokenPath = `/${bunnyVideoId}/`;
  const path = `/${bunnyVideoId}/playlist.m3u8`;
  const hashBase = `${env.BUNNY_TOKEN_AUTH_KEY}${tokenPath}${expires}token_path=${tokenPath}`;
  const token = createHash("sha256")
    .update(hashBase)
    .digest("base64")
    .replace(/\n/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return {
    streamUrl: `https://${env.BUNNY_CDN_HOSTNAME}${path}?token=${token}&expires=${expires}&token_path=${encodeURIComponent(tokenPath)}`,
    expiresIn: 3600,
  };
};

export const verifyBunnyWebhookSignature = (rawBody: string, headers: Record<string, string | string[] | undefined>) => {
  ensureBunnyEnv();

  const version = headers["x-bunnystream-signature-version"];
  const algorithm = headers["x-bunnystream-signature-algorithm"];
  const signature = headers["x-bunnystream-signature"];

  if (version !== "v1" || algorithm !== "hmac-sha256" || typeof signature !== "string") {
    throw new AppError("Invalid Bunny webhook signature headers", 400, "BUNNY_WEBHOOK_INVALID");
  }

  const expected = createHmac("sha256", env.BUNNY_STREAM_READONLY_API_KEY!)
    .update(rawBody, "utf8")
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(signature, "utf8");

  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    throw new AppError("Bunny webhook signature verification failed", 400, "BUNNY_WEBHOOK_INVALID");
  }
};
