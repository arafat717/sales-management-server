import { Types } from "mongoose";

export interface ICustomer {
  _id?: Types.ObjectId;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
