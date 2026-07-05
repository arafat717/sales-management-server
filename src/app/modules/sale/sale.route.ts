import { Router } from "express";
import { SaleController } from "./sale.controller";
import { validateRequest } from "../../middlewares/validationMiddleware";
import { createSaleSchema } from "./sale.validation";
import { checkAuth, checkPermission } from "../../utils/jwt";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE, Role.SUPER_ADMIN),
  checkPermission("sales", "create"),
  validateRequest(createSaleSchema),
  SaleController.createSale,
);
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE, Role.SUPER_ADMIN),
  checkPermission("sales", "read"),
  SaleController.getSales,
);

export const saleRoutes = router;
