import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { roleService } from "./role.service";

const getAllRoles = catchAsync(async (_req: Request, res: Response) => {
  const roles = await roleService.getAllRoles();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Roles retrieved successfully",
    data: roles,
  });
});

const createRole = catchAsync(async (req: Request, res: Response) => {
  const role = await roleService.createRole(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Role created successfully",
    data: role,
  });
});

const updateRole = catchAsync(async (req: Request, res: Response) => {
  const role = await roleService.updateRole(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Role updated successfully",
    data: role,
  });
});

export const RoleController = {
  getAllRoles,
  createRole,
  updateRole,
};
