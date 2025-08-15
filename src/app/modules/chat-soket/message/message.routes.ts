import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { MessageControllers } from "./message.controller";
import { createMessageZodSchema } from "./message.validation";
import { multerUpload } from "../../../../config/multer.config";
import { checkAuth } from "../../../middlewares/checkAuth";
import { Role } from "../../ph-tour/user/user.interface";

const router = Router();

// /api/v1/user/:id
router.post(
  "/create",
  checkAuth(...Object.values(Role)),
  multerUpload.single("file"),
  validateRequest(createMessageZodSchema),
  MessageControllers.createMessage
);

// Get all messages for one user
router.get(
  "/all-messages",
  checkAuth(...Object.values(Role)),
  MessageControllers.getAllMessagesOneUser
);

//selected user all messages
router.get(
  "/:id",
  checkAuth(...Object.values(Role)),
  MessageControllers.getAllMessages
);
// /api/v1/user/:id
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  MessageControllers.markAsSeen
);

export const SoketMessageRoutes = router;
