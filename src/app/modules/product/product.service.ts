/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FilterQuery } from "mongoose";
import AppError from "../../errorHelpers/appError";

import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import httpStatus from "http-status-codes";
import { buildQueryOptions, getPaginationMeta } from "../../utils/queryBuilder";

const createProductIntoDb = async (
  payload: Partial<IProduct>,
  imageFile?: Express.Multer.File,
) => {
  if (!imageFile) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Product image is required while creating a product",
    );
  }

  const existingProduct = await Product.findOne({ sku: payload.sku });
  if (existingProduct) {
    throw new AppError(httpStatus.CONFLICT, "Product SKU already exists");
  }

  const product = await Product.create({
    ...payload,
    imageUrl: `/uploads/${imageFile.filename}`,
  });

  return product;
};

const getProductsFromDb = async (query: Record<string, string | undefined>) => {
  const { filter, page, limit, sort, skip } = buildQueryOptions(query, [
    "name",
    "sku",
    "category",
  ]);

  const finalFilter: FilterQuery<IProduct> = {
    ...filter,
    isDeleted: false,
  };

  const [products, total] = await Promise.all([
    Product.find(finalFilter).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(finalFilter),
  ]);

  return {
    data: products,
    meta: getPaginationMeta(page, limit, total),
  };
};

const getProductByIdFromDb = async (productId: string) => {
  const product = await Product.findOne({ _id: productId, isDeleted: false });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  return product;
};

const updateProductIntoDb = async (
  productId: string,
  payload: Partial<IProduct>,
  imageFile?: Express.Multer.File,
) => {
  const product = await Product.findOne({ _id: productId, isDeleted: false });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  if (payload.sku) {
    const duplicateSku = await Product.findOne({
      sku: payload.sku,
      _id: { $ne: productId },
    });
    if (duplicateSku) {
      throw new AppError(httpStatus.CONFLICT, "Product SKU already exists");
    }
  }

  const updatedPayload = { ...payload } as Partial<IProduct>;
  if (imageFile) {
    updatedPayload.imageUrl = `/uploads/${imageFile.filename}`;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updatedPayload,
    { new: true, runValidators: true },
  );
  return updatedProduct;
};

const deleteProductFromDb = async (productId: string) => {
  const product = await Product.findOne({ _id: productId, isDeleted: false });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  await Product.findByIdAndUpdate(productId, { isDeleted: true });
  return true;
};

export const productService = {
  createProductIntoDb,
  getProductsFromDb,
  getProductByIdFromDb,
  updateProductIntoDb,
  deleteProductFromDb,
};
