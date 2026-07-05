import { Types } from "mongoose";

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export enum isActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
  USER = "USER",
  GUIDE = "GUIDE",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: Role;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: isActive;
  isVerified?: boolean;
  auths: IAuthProvider[];
  booking?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
