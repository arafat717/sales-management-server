import { model, Schema } from "mongoose";
import { ICustomer } from "./customer.interface";

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

export const Customer = model<ICustomer>("Customer", customerSchema);
