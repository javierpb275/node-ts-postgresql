import jwt from "jsonwebtoken";
import config from "../config/config";
import { Request, Response, NextFunction } from "express";

export interface IPayload {
  id: string;
  iat: number;
  exp: number;
}

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader: string | undefined = req.header("Authorization");
    if (!authHeader) {
      throw new Error();
    }

    const token: string = authHeader.split(" ")[1];
    if (!token) {
      throw new Error();
    }

    const payload = jwt.verify(
      token,
      config.AUTH.ACCESS_TOKEN_SECRET
    ) as IPayload;

    req.user_email = payload.id;

    next();
  } catch (err) {
    res.status(401).send({ error: "Please authenticate" });
  }
};
