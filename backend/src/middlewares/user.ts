import { NextFunction, Request, Response } from "express";
import { verify } from "../utils/token";
import { db } from "../config/db";
import { ErrorHandler } from "../utils/errorhandler";

const middlware = async (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.cookies.Token;


  if (!token) {
    return next(new ErrorHandler("No token", 400));
  }

  const payload = verify(token);

  if (!payload) {
    res.clearCookie("token");
    const message: string = "Something went wrong";
    return next(new ErrorHandler(message, 500));
  }

  const response = await db.user.findUnique({ where: { id: payload.id } });

  if (!response) {
    res.clearCookie("token");
    const message: string = "User doesn't exist";
    return next(new ErrorHandler(message, 400));
  }

  req.user = response;

  return next();
};

export default middlware;
