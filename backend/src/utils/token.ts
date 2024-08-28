import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

export const sign = (response: User): String => {
  const payload = { id: response.id, email: response.email };

  if (!process.env.JWT_SECRET) {
    return "";
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return token;
};
