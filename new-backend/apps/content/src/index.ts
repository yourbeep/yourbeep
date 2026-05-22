import { connectMongo, env, logger } from "@yourbeep/shared";
import { createContentApp } from "./app";

const bootstrap = async () => {
  await connectMongo(env.MONGODB_URI_CONTENT, "content-service");
  const app = createContentApp();

  app.listen(env.CONTENT_PORT, () => {
    logger.info({ port: env.CONTENT_PORT }, "Content service listening");
  });
};

bootstrap().catch((error) => {
  logger.error({ error }, "Content service failed to start");
  process.exit(1);
});
