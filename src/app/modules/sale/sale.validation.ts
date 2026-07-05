import { z } from "zod";

export const createSaleSchema = z.object({
  customer: z.string().min(1, "Customer is required"),
  items: z
    .array(
      z.object({
        product: z.string().min(1, "Product is required"),
        quantity: z.number().int().positive("Quantity must be at least 1"),
      }),
    )
    .min(1, "At least one sale item is required"),
});
