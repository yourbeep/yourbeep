import { Router } from "express";
import { asyncHandler, requireAuth } from "@yourbeep/shared";
import {
  deleteAccountController,
  getMeController,
  syncAuthController,
} from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/sync", asyncHandler(syncAuthController));
authRouter.get("/me", requireAuth, asyncHandler(getMeController));
authRouter.delete("/account", requireAuth, asyncHandler(deleteAccountController));
