/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { createUserToken, genarateToken, verifyToken } from "../../utils/jwt";
import { isActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/appError";
import httpsStatus from 'http-status-codes'
import bcrypt from "bcryptjs";


const userLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
        throw new Error("User does not exist");
    }

    const isPasswordValid = await bcrypt.compare(password as string, isUserExist.password!);

    if (!isPasswordValid) {
        throw new Error("Incorrect password");
    }

    const accessToken = createUserToken(isUserExist)
    const refreshToken = createUserToken(isUserExist)

    const { password: pass, ...rest } = isUserExist.toObject();

    return {
        accessToken: accessToken.accessToken,
        refreshToken: refreshToken.refreshToken,
        data: rest
    };
}


const createNewAccessToken = async (refreshToken: string) => {

    const token = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET as string)

    const isUserExist = await User.findOne({ email: token.email });

    if (!isUserExist) {
        throw new Error("User does not exist");
    }

    if (isUserExist.isActive === isActive.BLOCKED || isUserExist.isActive === isActive.INACTIVE) {
        throw new Error(`User is ${isUserExist.isActive}`);
    }

    if (isUserExist.isDeleted) {
        throw new Error(`User is deleted!`);
    }

    const tokenPayload = {
        id: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    };

    const accessToken = genarateToken(tokenPayload, envVars.JWT_SECRET!, envVars.JWT_EXPIRES_IN!);

    return {
        accessToken
    };
}


const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    console.log("old pass ==>", oldPassword)
    const user = await User.findById(decodedToken.id)
    console.log("user ==>", user?.password)

    const isPasswordValid = await bcrypt.compare(oldPassword as string, user!.password as string);
    console.log(isPasswordValid)
    if (!isPasswordValid) {
        throw new AppError(httpsStatus.UNAUTHORIZED, `Old Password does not match!`);
    }

    user!.password = await bcrypt.hash(newPassword, 12)
    user!.save()

    return true

}






export const authService = {
    userLogin,
    createNewAccessToken,
    changePassword
};