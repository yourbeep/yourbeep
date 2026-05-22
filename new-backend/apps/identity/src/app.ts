import { attachErrorHandler, buildBaseApp } from "@yourbeep/shared";
import { authRouter } from "./routes/auth";
import { contactRequestRouter } from "./routes/contact-request.routes";
import { internalRouter } from "./routes/internal";
import { platformSettingsRouter } from "./routes/platform-settings.routes";
import { supportTicketRouter } from "./routes/support-ticket.routes";
import { testimonialRouter } from "./routes/testimonial.routes";
import { usersRouter } from "./routes/users";

export const createIdentityApp = () => {
  const app = buildBaseApp("identity-service");

  app.use("/auth", authRouter);
  app.use("/", usersRouter);
  app.use("/", contactRequestRouter);
  app.use("/", supportTicketRouter);
  app.use("/", testimonialRouter);
  app.use("/", platformSettingsRouter);
  app.use("/internal", internalRouter);

  attachErrorHandler(app);
  return app;
};
