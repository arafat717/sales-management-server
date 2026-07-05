import { RoleModel } from "./role.model";
import AppError from "../../errorHelpers/appError";
import httpStatus from "http-status-codes";

const ensureDefaultRoles = async () => {
  const defaults = [
    {
      name: "SUPER_ADMIN",
      description: "Full system access",
      isDefault: true,
      permissions: [
        {
          resource: "products",
          actions: ["create", "read", "update", "delete"],
        },
        {
          resource: "customers",
          actions: ["create", "read", "update", "delete"],
        },
        { resource: "sales", actions: ["create", "read", "update", "delete"] },
        { resource: "dashboard", actions: ["read"] },
        { resource: "users", actions: ["create", "read", "update", "delete"] },
      ],
    },
    {
      name: "ADMIN",
      description: "Administrative access",
      isDefault: true,
      permissions: [
        {
          resource: "products",
          actions: ["create", "read", "update", "delete"],
        },
        {
          resource: "customers",
          actions: ["create", "read", "update", "delete"],
        },
        { resource: "sales", actions: ["create", "read", "update", "delete"] },
        { resource: "dashboard", actions: ["read"] },
      ],
    },
    {
      name: "MANAGER",
      description: "Manage products and customers",
      isDefault: true,
      permissions: [
        {
          resource: "products",
          actions: ["create", "read", "update", "delete"],
        },
        {
          resource: "customers",
          actions: ["create", "read", "update", "delete"],
        },
        { resource: "sales", actions: ["create", "read"] },
        { resource: "dashboard", actions: ["read"] },
      ],
    },
    {
      name: "EMPLOYEE",
      description: "Basic sales and product viewing access",
      isDefault: true,
      permissions: [
        { resource: "products", actions: ["read"] },
        { resource: "customers", actions: ["create", "read"] },
        { resource: "sales", actions: ["create", "read"] },
        { resource: "dashboard", actions: ["read"] },
      ],
    },
  ];

  for (const role of defaults) {
    const existing = await RoleModel.findOne({ name: role.name });
    if (!existing) {
      await RoleModel.create(role);
    }
  }
};

const getAllRoles = async () => {
  return RoleModel.find().sort({ createdAt: -1 });
};

interface Permission {
  resource: string;
  actions: string[];
}

const createRole = async (payload: {
  name: string;
  description?: string;
  permissions: Permission[];
  isDefault?: boolean;
}) => {
  const existing = await RoleModel.findOne({ name: payload.name });
  if (existing) {
    throw new AppError(httpStatus.CONFLICT, "Role already exists");
  }

  return RoleModel.create(payload);
};

const updateRole = async (
  roleId: string,
  payload: Partial<{
    name: string;
    description?: string;
    permissions: Permission[];
    isDefault?: boolean;
  }>,
) => {
  const role = await RoleModel.findById(roleId);
  if (!role) {
    throw new AppError(httpStatus.NOT_FOUND, "Role not found");
  }

  const updatedRole = await RoleModel.findByIdAndUpdate(roleId, payload, {
    new: true,
    runValidators: true,
  });
  return updatedRole;
};

const getRoleByName = async (name: string) => {
  const role = await RoleModel.findOne({ name });
  if (!role) {
    throw new AppError(httpStatus.NOT_FOUND, "Role not found");
  }

  return role;
};

const getPermissionsForRole = async (name: string) => {
  const role = await getRoleByName(name);
  return role.permissions;
};

const canAccess = async (
  roleName: string,
  resource: string,
  action: string,
) => {
  const role = await getRoleByName(roleName);
  const permission = role.permissions.find(
    (entry) => entry.resource === resource,
  );
  return Boolean(permission?.actions.includes(action));
};

export const roleService = {
  ensureDefaultRoles,
  getAllRoles,
  createRole,
  updateRole,
  getRoleByName,
  getPermissionsForRole,
  canAccess,
};
