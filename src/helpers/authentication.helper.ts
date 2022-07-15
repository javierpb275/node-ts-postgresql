import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const generateToken = (
  userId: string,
  secret: string,
  expiration: string
): string => {
  const token: string = jwt.sign({ id: userId }, secret, {
    expiresIn: expiration,
  });
  return token;
};

export const hashPassword = async (password: string): Promise<string> => {
  const rounds: number = 10;
  const salt: string = await bcrypt.genSalt(rounds);
  const hash: string = await bcrypt.hash(password, salt);
  return hash;
};

export const comparePassword = async (
  inputPassword: string,
  userPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, userPassword);
};
