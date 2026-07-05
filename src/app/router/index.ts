import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { productRoutes } from "../modules/product/product.route";
import { customerRoutes } from "../modules/customer/customer.route";
import { saleRoutes } from "../modules/sale/sale.route";
import { dashboardRoutes } from "../modules/dashboard/dashboard.route";
import { roleRoutes } from "../modules/role/role.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/products",
    route: productRoutes,
  },
  {
    path: "/customers",
    route: customerRoutes,
  },
  {
    path: "/sales",
    route: saleRoutes,
  },
  {
    path: "/dashboard",
    route: dashboardRoutes,
  },
  {
    path: "/roles",
    route: roleRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
