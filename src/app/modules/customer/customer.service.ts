import AppError from "../../errorHelpers/appError";
import { buildQueryOptions, getPaginationMeta } from "../../utils/queryBuilder";

import { ICustomer } from "./customer.interface";
import { Customer } from "./customer.model";
import httpStatus from "http-status-codes";

const createCustomerIntoDb = async (payload: Partial<ICustomer>) => {
  const customer = await Customer.create(payload);
  return customer;
};

const getCustomersFromDb = async (
  query: Record<string, string | undefined>,
) => {
  const { filter, page, limit, sort, skip } = buildQueryOptions(query, [
    "name",
    "email",
    "phone",
  ]);

  const finalFilter = { ...filter, isDeleted: false };
  const [customers, total] = await Promise.all([
    Customer.find(finalFilter).sort(sort).skip(skip).limit(limit),
    Customer.countDocuments(finalFilter),
  ]);

  return {
    data: customers,
    meta: getPaginationMeta(page, limit, total),
  };
};

const getCustomerByIdFromDb = async (customerId: string) => {
  const customer = await Customer.findOne({
    _id: customerId,
    isDeleted: false,
  });
  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
  }

  return customer;
};

const updateCustomerIntoDb = async (
  customerId: string,
  payload: Partial<ICustomer>,
) => {
  const customer = await Customer.findOne({
    _id: customerId,
    isDeleted: false,
  });
  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(
    customerId,
    payload,
    { new: true, runValidators: true },
  );
  return updatedCustomer;
};

const deleteCustomerFromDb = async (customerId: string) => {
  const customer = await Customer.findOne({
    _id: customerId,
    isDeleted: false,
  });
  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
  }

  await Customer.findByIdAndUpdate(customerId, { isDeleted: true });
  return true;
};

export const customerService = {
  createCustomerIntoDb,
  getCustomersFromDb,
  getCustomerByIdFromDb,
  updateCustomerIntoDb,
  deleteCustomerFromDb,
};
