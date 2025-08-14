import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateRequest } from "../../../middlewares/validateRequest";
import { Role } from "./user.interface";
import { checkAuth } from "../../../middlewares/checkAuth";
import { multerUpload } from "../../../../config/multer.config";

const router = Router();

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
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getSingleUser
);
router.patch(
  "/:id",
  multerUpload.single("file"),
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);
// /api/v1/user/:id

export const UserRoutes = router;
