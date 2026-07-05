import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { customerService } from "./customer.service";

const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const customer = await customerService.createCustomerIntoDb(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Customer created successfully",
    data: customer,
  });
});

const getCustomers = catchAsync(async (req: Request, res: Response) => {
  const result = await customerService.getCustomersFromDb(
    req.query as Record<string, string | undefined>,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customers retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getCustomerById = catchAsync(async (req: Request, res: Response) => {
  const customer = await customerService.getCustomerByIdFromDb(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customer retrieved successfully",
    data: customer,
  });
});

const updateCustomer = catchAsync(async (req: Request, res: Response) => {
  const customer = await customerService.updateCustomerIntoDb(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customer updated successfully",
    data: customer,
  });
});

const deleteCustomer = catchAsync(async (req: Request, res: Response) => {
  await customerService.deleteCustomerFromDb(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customer deleted successfully",
    data: undefined,
  });
});

export const CustomerController = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
