import { env, logger } from "@yourbeep/shared";
import { createGatewayApp } from "./app";

const app = createGatewayApp();

app.listen(env.GATEWAY_PORT, () => {
  logger.info({ port: env.GATEWAY_PORT }, "API gateway listening");
});
