import { Pool } from "pg";
import config from "../config/config";

export const pool = new Pool({
  host: config.DB.HOST,
  user: config.DB.USER,
  password: config.DB.PASSWORD,
  database: config.DB.NAME,
  port: config.DB.PORT,
});
