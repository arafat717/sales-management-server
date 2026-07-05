import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Product } from "../product/product.model";
import { Customer } from "../customer/customer.model";
import { Sale } from "../sale/sale.model";

const getDashboardStats = catchAsync(async (_req: Request, res: Response) => {
  const [totalProducts, totalCustomers, totalSales, lowStockProducts] =
    await Promise.all([
      Product.countDocuments({ isDeleted: false }),
      Customer.countDocuments({ isDeleted: false }),
      Sale.countDocuments(),
      Product.find({ isDeleted: false, stockQuantity: { $lt: 5 } }).select(
        "name stockQuantity sku",
      ),
    ]);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard statistics retrieved successfully",
    data: {
      totalProducts,
      totalCustomers,
      totalSales,
      lowStockProducts,
    },
  });
});

export const DashboardController = {
  getDashboardStats,
};
