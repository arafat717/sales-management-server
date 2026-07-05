import { model, Schema } from "mongoose";
import { ISale, ISaleItem } from "./sale.interface";

const saleItemSchema = new Schema<ISaleItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false, versionKey: false },
);

const saleSchema = new Schema<ISale>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    items: [saleItemSchema],
    grandTotal: { type: Number, required: true, min: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, versionKey: false },
);

export const Sale = model<ISale>("Sale", saleSchema);
