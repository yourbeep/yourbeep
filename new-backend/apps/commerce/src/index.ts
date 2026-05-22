import { connectMongo, env, logger } from "@yourbeep/shared";
import { createCommerceApp } from "./app";

const bootstrap = async () => {
  await connectMongo(env.MONGODB_URI_COMMERCE, "commerce-service");
  const app = createCommerceApp();

  app.listen(env.COMMERCE_PORT, () => {
    logger.info({ port: env.COMMERCE_PORT }, "Commerce service listening");
  });
};

bootstrap().catch((error) => {
  logger.error({ error }, "Commerce service failed to start");
  process.exit(1);
});
