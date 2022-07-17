import { Request, Response } from "express";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../helpers/authentication.helper";
import config from "../config/config";
import { pool } from "../db/postgres";
import { QueryResult } from "pg";
import { isCorrectEmail, isSecurePassword } from "../helpers/validation.helper";

let refreshTokens: string[] = [];

export default class UserController {
  public static async signUp(req: Request, res: Response): Promise<Response> {
    const { username, user_email, user_password } = req.body;
    if (!username) {
      return res
        .status(400)
        .send({ result: false, data: "Please, provide a username." });
    }
    if (!user_email) {
      return res
        .status(400)
        .send({ result: false, data: "Please, provide an email." });
    }
    if (!user_password) {
      return res
        .status(400)
        .send({ result: false, data: "Please, provide a password." });
    }
    if (!isCorrectEmail(user_email)) {
      return res.status(400).send({
        result: false,
        data: `${user_email} is not an email.`,
      });
    }
    if (!isSecurePassword(user_password)) {
      return res.status(400).send({
        result: false,
        data: "Passwords must have at least 6 characters, one lowercase letter, one uppercase letter and one number",
      });
    }
    try {
      const hash: string = await hashPassword(user_password);
      const response: QueryResult = await pool.query(
        "INSERT INTO users (username, user_email, user_password) VALUES ($1, $2, $3)",
        [username, user_email, hash]
      );
      console.log(response);
      const accessToken: string = generateToken(
        user_email,
        config.AUTH.ACCESS_TOKEN_SECRET,
        config.AUTH.ACCESS_TOKEN_EXPIRATION
      );
      const refreshToken: string = generateToken(
        user_email,
        config.AUTH.REFRESH_TOKEN_SECRET,
        config.AUTH.REFRESH_TOKEN_EXPIRATION
      );
      refreshTokens.push(refreshToken);
      return res.status(201).send({
        result: true,
        data: {
          user: {
            username,
            user_email,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      return res
        .status(400)
        .send({ result: false, data: "Error creating user." });
    }
  }

  public static async signIn(req: Request, res: Response): Promise<Response> {
    const { user_email, user_password } = req.body;
    if (!user_email) {
      return res
        .status(400)
        .send({ result: false, data: "Please, provide an email." });
    }
    if (!user_password) {
      return res
        .status(400)
        .send({ result: false, data: "Please, provide a password." });
    }
    try {
      const response: QueryResult = await pool.query(
        "SELECT id, username, user_email FROM users WHERE user_email = $1",
        [user_email]
      );
      if (response.rowCount === 0) {
        return res
          .status(404)
          .send({ result: false, data: "Wrong credentials." });
      }
      const isMatch: boolean = await comparePassword(
        user_password,
        response.rows[0].password
      );
      if (!isMatch) {
        return res
          .status(400)
          .send({ result: false, data: "Wrong credentials." });
      }
      const accessToken: string = generateToken(
        user_email,
        config.AUTH.ACCESS_TOKEN_SECRET,
        config.AUTH.ACCESS_TOKEN_EXPIRATION
      );
      const refreshToken: string = generateToken(
        user_email,
        config.AUTH.REFRESH_TOKEN_SECRET,
        config.AUTH.REFRESH_TOKEN_EXPIRATION
      );
      refreshTokens.push(refreshToken);
      return res.status(200).send({
        result: true,
        data: {
          user: response.rows[0],
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      return res
        .status(400)
        .send({ result: false, data: "Unable to sign in." });
    }
  }

  public static async signOut(req: Request, res: Response): Promise<Response> {
    if (!req.body.refreshToken) {
      return res
        .status(400)
        .send({ result: false, data: "Please, provide refresh token." });
    }
    if (!refreshTokens.includes(req.body.refreshToken)) {
      return res
        .status(400)
        .send({ result: false, data: "Refresh Token Invalid." });
    }
    try {
      refreshTokens = refreshTokens.filter(
        (reToken) => reToken != req.body.refreshToken
      );
      return res
        .status(200)
        .send({ result: true, data: "Signed Out Successfully!" });
    } catch (err) {
      return res
        .status(500)
        .send({ result: false, data: "Unable to sign out." });
    }
  }

  public static async getProfile(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { user_email } = req;
    try {
      const response: QueryResult = await pool.query(
        "SELECT id, username, user_email FROM users WHERE user_email = $1",
        [user_email]
      );
      if (response.rowCount === 0) {
        return res.status(404).send({ result: false, data: "User Not found." });
      }
      return res.status(200).send({
        result: true,
        data: response.rows[0],
      });
    } catch (err) {
      return res.status(500).send({ error: err });
    }
  }
}