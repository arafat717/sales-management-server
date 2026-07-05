import { Types } from "mongoose";

export interface IRolePermission {
  resource: string;
  actions: string[];
}

export interface IRoleDocument {
  _id?: Types.ObjectId;
  name: string;
  description?: string;
  permissions: IRolePermission[];
  isDefault?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
