import { Types } from "mongoose";

export interface ISaleItem {
  product: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ISale {
  _id?: Types.ObjectId;
  customer: Types.ObjectId;
  items: ISaleItem[];
  grandTotal: number;
  createdBy?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
