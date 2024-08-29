import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWTPayloadType } from "./types/types";

export const sign = (response: User): String => {
  const payload = { id: response.id, email: response.email };

  if (!process.env.JWT_SECRET) {
    return "";
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

export const verify = (token: string): JWTPayloadType | null => {
  if (!process.env.JWT_SECRET) {
    return null;
  }

  const payload: JWTPayloadType = jwt.verify(token, process.env.JWT_SECRET) as JWTPayloadType;
  return payload;
};
