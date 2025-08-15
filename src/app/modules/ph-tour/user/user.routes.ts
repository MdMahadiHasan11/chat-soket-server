import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../../middlewares/validateRequest";
import { Role } from "./user.interface";
import { checkAuth } from "../../../middlewares/checkAuth";
import { multerUpload } from "../../../../config/multer.config";
import { SoketUserControllers } from "../../chat-socket/user/user.controller";

const router = Router();
router.get(
  "/sidebar/:id",
  checkAuth(...Object.values(Role)),
  SoketUserControllers.getAllUsersForSidebar
);

// ////////////////
router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);
router.patch(
  "/:id",
  multerUpload.single("file"),
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getSingleUser
);
// /api/v1/user/:id

export const UserRoutes = router;
