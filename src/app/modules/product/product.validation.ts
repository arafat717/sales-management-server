import { z } from "zod";

const numberSchema = z
  .union([z.number(), z.string()])
  .transform((value) => Number(value));

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  sku: z.string().min(2, "SKU is required"),
  category: z.string().min(2, "Category is required"),
  purchasePrice: numberSchema.refine(
    (value) => value >= 0,
    "Purchase price cannot be negative",
  ),
  sellingPrice: numberSchema.refine(
    (value) => value >= 0,
    "Selling price cannot be negative",
  ),
  stockQuantity: numberSchema.refine(
    (value) => Number.isInteger(value) && value >= 0,
    "Stock quantity cannot be negative",
  ),
});

export const updateProductSchema = createProductSchema.partial().strict();
