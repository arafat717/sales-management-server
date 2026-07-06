import { Router } from "express";
import multer from 'multer';
import path from "path";
import { ProductController } from "./product.controller";
import { validateRequest } from "../../middlewares/validationMiddleware";
import { createProductSchema, updateProductSchema } from "./product.validation";
import { checkAuth, checkPermission } from "../../utils/jwt";
import { Role } from "../user/user.interface";

const router = Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "uploads"),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN),
  checkPermission("products", "create"),
  upload.single("image"),
  validateRequest(createProductSchema),
  ProductController.createProduct,
);

router.get("/", ProductController.getProducts);
router.get("/:id", ProductController.getProductById);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN),
  checkPermission("products", "update"),
  upload.single("image"),
  validateRequest(updateProductSchema),
  ProductController.updateProduct,
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.MANAGER, Role.SUPER_ADMIN),
  checkPermission("products", "delete"),
  ProductController.deleteProduct,
);

export const productRoutes = router;
