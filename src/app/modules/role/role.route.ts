import { Router } from "express";
import { RoleController } from "./role.controller";
import { validateRequest } from "../../middlewares/validationMiddleware";
import { createRoleSchema, updateRoleSchema } from "./role.validation";
import { checkAuth, checkPermission } from "../../utils/jwt";
import { Role } from "../user/user.interface";

const router = Router();

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  checkPermission("users", "read"),
  RoleController.getAllRoles,
);

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  checkPermission("users", "create"),
  validateRequest(createRoleSchema),
  RoleController.createRole,
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  checkPermission("users", "update"),
  validateRequest(updateRoleSchema),
  RoleController.updateRole,
);

export const roleRoutes = router;
