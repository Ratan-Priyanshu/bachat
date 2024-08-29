import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middlewares/catchAsyncError";
import { Account, Transactions } from "@prisma/client";
import { db } from "../config/db";
import { ErrorHandler } from "../utils/errorhandler";

const controller = {
  add: CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      const payload: Transactions = req.body;

      if (!req.user) {
        res.clearCookie("token");
        const message: string = "Unauthorized";
        return next(new ErrorHandler(message, 400));
      }

      const userId: string = req.user.id;

      const response = await db.transactions.create({
        data: {
          amount: payload.amount,
          type: payload.type,
          category: payload.category,
          userId: userId,
        },
      });

      let updateAccount: Account;

      if (payload.type === "SENT") {
        updateAccount = await db.account.update({
          where: { userId: userId },
          data: { balance: { decrement: response.amount } },
        });
      } else {
        updateAccount = await db.account.update({
          where: { userId: userId },
          data: { balance: { increment: response.amount } },
        });
      }

      return res.status(200).json({
        success: true,
        message: updateAccount,
      });
    }
  ),

  delete: CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.params.id) {
        const message: string = "Bad request";
        return next(new ErrorHandler(message, 400));
      }

      if (!req.user) {
        res.clearCookie("token");
        const message: string = "Unauthorized";
        return next(new ErrorHandler(message, 400));
      }

      const requestId: string = req.params.id as string;
      const userId: string = req.user.id;

      const response = await db.transactions.delete({
        where: { id: requestId },
      });

      let updateAccount: Account;

      if (response.type === "RECEIVED") {
        updateAccount = await db.account.update({
          where: { userId: userId },
          data: { balance: { decrement: response.amount } },
        });
      } else {
        updateAccount = await db.account.update({
          where: { userId: userId },
          data: { balance: { increment: response.amount } },
        });
      }

      return res.status(200).json({
        success: true,
        message: updateAccount,
      });
    }
  ),
};

export default controller;
