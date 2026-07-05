import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(2, "Customer name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(5, "Phone is required"),
  address: z.string().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial().strict();
