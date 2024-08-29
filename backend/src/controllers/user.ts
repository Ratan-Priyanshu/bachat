import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { db } from "../config/db";
import { sign } from "../utils/token";
import { SigninType, SignupType } from "../utils/types/types";
import { CatchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../utils/errorhandler";

const controller = {
  signup: CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const payload: SignupType = req.body;

      const response = await db.user.create({
        data: {
          name: payload.name,
          email: payload.email,
          password: payload.password,
        },
      });

      const account = await db.account.create({
        data: {
          balance: 0,
          limit: payload.limit,
          userId: response.id,
        },
      });

      if (!account) {
        const message = "Something went wrong";
        return next(new ErrorHandler(message, 500));
      }

      const token = sign(response);

      res.cookie("Token", token);

      return res.status(200).json({
        success: true,
        message: token,
      });
    }
  ),

  signin: CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const payload: SigninType = req.body;

      const response = await db.user.findUnique({
        where: { email: payload.email },
      });

      if (!response) {
        const message = "User doesn't exist";
        return next(new ErrorHandler(message, 400));
      }

      const isMatch = response.password === payload.password;

      if (!isMatch) {
        const message = "Invalid password";
        return next(new ErrorHandler(message, 400));
      }

      const token = sign(response);

      res.cookie("Token", token);

      return res.status(200).json({
        success: false,
        message: token,
      });
    }
  ),
};

export default controller;
