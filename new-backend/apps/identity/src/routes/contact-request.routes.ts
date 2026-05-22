import { Router } from "express";
import { asyncHandler, requireAdmin } from "@yourbeep/shared";
import {
  createContactRequestController,
  getContactRequestByIdController,
  listContactRequestsController,
  updateContactRequestController,
} from "../controllers/contact-request.controller";

export const contactRequestRouter = Router();

contactRequestRouter.post("/get-in-touch", asyncHandler(createContactRequestController));

contactRequestRouter.get("/admin/get-in-touch", requireAdmin, asyncHandler(listContactRequestsController));
contactRequestRouter.get("/admin/get-in-touch/:requestId", requireAdmin, asyncHandler(getContactRequestByIdController));
contactRequestRouter.patch("/admin/get-in-touch/:requestId", requireAdmin, asyncHandler(updateContactRequestController));
