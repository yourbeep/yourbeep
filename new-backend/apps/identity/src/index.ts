import { env, logger, connectMongo } from "@yourbeep/shared";
import { createIdentityApp } from "./app";

const bootstrap = async () => {
  await connectMongo(env.MONGODB_URI_IDENTITY, "identity-service");
  const app = createIdentityApp();

  app.listen(env.IDENTITY_PORT, () => {
    logger.info({ port: env.IDENTITY_PORT }, "Identity service listening");
  });
};

bootstrap().catch((error) => {
  logger.error({ error }, "Identity service failed to start");
  process.exit(1);
});
