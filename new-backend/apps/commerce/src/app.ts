import { attachErrorHandler, buildBaseApp } from "@yourbeep/shared";
import { adminRouter } from "./routes/admin.routes";
import { internalRouter } from "./routes/internal.routes";
import { pricingRouter } from "./routes/pricing.routes";
import { promotionRouter } from "./routes/promotion.routes";
import { purchaseRouter } from "./routes/purchase.routes";

export const createCommerceApp = () => {
  const app = buildBaseApp("commerce-service");

  app.use("/", pricingRouter);
  app.use("/", purchaseRouter);
  app.use("/", promotionRouter);
  app.use("/", adminRouter);
  app.use("/internal", internalRouter);

  attachErrorHandler(app);
  return app;
};
