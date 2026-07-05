import { model, Schema } from "mongoose";
import { IRoleDocument } from "./role.interface";

const permissionSchema = new Schema(
  {
    resource: { type: String, required: true },
    actions: [{ type: String, required: true }],
  },
  { _id: false, versionKey: false },
);

const roleSchema = new Schema<IRoleDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    permissions: [permissionSchema],
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

export const RoleModel = model<IRoleDocument>("Role", roleSchema);
