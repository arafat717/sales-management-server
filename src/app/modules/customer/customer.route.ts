import { Router } from "express";
import { CustomerController } from "./customer.controller";
import { validateRequest } from "../../middlewares/validationMiddleware";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "./customer.validation";
import { checkAuth, checkPermission } from "../../utils/jwt";
import { Role } from "../user/user.interface";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE, Role.SUPER_ADMIN),
  checkPermission("customers", "create"),
  validateRequest(createCustomerSchema),
  CustomerController.createCustomer,
);
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE, Role.SUPER_ADMIN),
  checkPermission("customers", "read"),
  CustomerController.getCustomers,
);
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE, Role.SUPER_ADMIN),
  checkPermission("customers", "read"),
  CustomerController.getCustomerById,
);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN),
  checkPermission("customers", "update"),
  validateRequest(updateCustomerSchema),
  CustomerController.updateCustomer,
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN),
  checkPermission("customers", "delete"),
  CustomerController.deleteCustomer,
);

export const customerRoutes = router;
