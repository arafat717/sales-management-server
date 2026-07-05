import AppError from "../../errorHelpers/appError";
import { Product } from "../product/product.model";
import { Customer } from "../customer/customer.model";
import { Sale } from "./sale.model";
import httpStatus from "http-status-codes";

const createSaleIntoDb = async (
  payload: {
    customer: string;
    items: { product: string; quantity: number }[];
  },
  userId: string,
) => {
  const customer = await Customer.findOne({
    _id: payload.customer,
    isDeleted: false,
  });
  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, "Customer not found");
  }

  const productIds = payload.items.map((item) => item.product);
  const products = await Product.find({
    _id: { $in: productIds },
    isDeleted: false,
  });

  if (products.length !== productIds.length) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "One or more products were not found",
    );
  }

  const saleItems: {
    product: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[] = [];
  let grandTotal = 0;

  for (const item of payload.items) {
    const product = products.find((p) => p._id?.toString() === item.product);
    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }

    if (product.stockQuantity < item.quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Insufficient stock for ${product.name}`,
      );
    }

    const totalPrice = product.sellingPrice * item.quantity;
    grandTotal += totalPrice;

    saleItems.push({
      product: item.product,
      quantity: item.quantity,
      unitPrice: product.sellingPrice,
      totalPrice,
    });

    product.stockQuantity -= item.quantity;
    await product.save();
  }

  const sale = await Sale.create({
    customer: payload.customer,
    items: saleItems,
    grandTotal,
    createdBy: userId,
  });

  return sale;
};

const getSalesFromDb = async () => {
  return Sale.find()
    .populate("customer")
    .populate("items.product")
    .populate("createdBy");
};

export const saleService = {
  createSaleIntoDb,
  getSalesFromDb,
};
