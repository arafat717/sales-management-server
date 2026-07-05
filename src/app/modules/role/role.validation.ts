import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(2, "Role name is required"),
  description: z.string().optional(),
  permissions: z.array(
    z.object({
      resource: z.string().min(1),
      actions: z.array(z.string().min(1)).min(1),
    }),
  ),
  isDefault: z.boolean().optional(),
});

export const updateRoleSchema = createRoleSchema.partial().strict();
