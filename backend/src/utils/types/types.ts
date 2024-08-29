import { User } from "@prisma/client";

export type SignupType = User & { limit: number };

export type SigninType = {
  email: string;
  password: string;
};

export type JWTPayloadType = {
  id: string;
  email: string;
};
