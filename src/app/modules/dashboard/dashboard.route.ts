import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { checkAuth, checkPermission } from "../../utils/jwt";
import { Role } from "../user/user.interface";

const router = Router();

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE, Role.SUPER_ADMIN),
  checkPermission("dashboard", "read"),
  DashboardController.getDashboardStats,
);

export const dashboardRoutes = router;
