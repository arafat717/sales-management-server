import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { saleService } from "./sale.service";

const createSale = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as { id?: string } | undefined)?.id ?? "";
  const sale = await saleService.createSaleIntoDb(req.body, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Sale created successfully",
    data: sale,
  });
});

const getSales = catchAsync(async (_req: Request, res: Response) => {
  const sales = await saleService.getSalesFromDb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sales retrieved successfully",
    data: sales,
  });
});

export const SaleController = {
  createSale,
  getSales,
};
