import { Request, Response } from "express";
import { pool } from "../db/postgres";
import { QueryResult } from "pg";

export default class TaskController {
  public static async createTask(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { user_id, body } = req;
    try {
      const response: QueryResult = await pool.query(
        "INSERT INTO tasks (user_id, task_description) VALUES ($1, $2) RETURNING task_description, done, task_id",
        [user_id, body.task_description]
      );
      return res.status(201).send({
        error: false,
        data: {
          task: response.rows[0],
        },
      });
    } catch (err) {
      return res.status(400).send({ error: true, data: err });
    }
  }
  public static async getTaskById(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { params, user_id } = req;
    try {
      const response: QueryResult = await pool.query(
        "SELECT task_id, task_description, done FROM tasks WHERE task_id = $1 AND user_id = $2",
        [params.id, user_id]
      );
      if (response.rowCount <= 0) {
        return res.status(404).send({ error: true, data: "Task Not found." });
      }
      return res.status(200).send({
        error: false,
        data: {
          task: response.rows[0],
        },
      });
    } catch (err) {
      return res.status(500).send({ error: true, data: err });
    }
  }
  public static async getTasks(req: Request, res: Response): Promise<Response> {
    const { user_id } = req;
    try {
      const response: QueryResult = await pool.query(
        "SELECT task_id, task_description, done FROM tasks WHERE user_id = $2",
        [user_id]
      );
      return res.status(200).send({
        error: false,
        data: {
          task: response.rows,
        },
      });
    } catch (err) {
      return res.status(500).send({ error: true, data: err });
    }
  }
  public static async updateTask(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { body, user_id, params } = req;
    let response: QueryResult;
    try {
      response = await pool.query(
        "UPDATE tasks SET task_description = $1, done = $2 WHERE user_id = $3 AND task_id = $4 RETURNING task_id, task_description, done",
        [body.task_description, body.done, user_id, params.id]
      );
      if (response.rowCount <= 0) {
        return res.status(404).send({ error: true, data: "Task Not found." });
      }
      return res.status(200).send({
        error: false,
        data: {
          task: response.rows[0],
        },
      });
    } catch (err) {
      return res.status(400).send({ error: true, data: err });
    }
  }
  public static async deleteTask(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { user_id, params } = req;
    try {
      const response: QueryResult = await pool.query(
        "DELETE FROM tasks WHERE user_id = $1 AND task_id = $2 RETURNING task_id, task_description, done",
        [user_id, params.id]
      );
      if (response.rowCount <= 0) {
        return res.status(404).send({ error: true, data: "Task Not found." });
      }
      return res
        .status(200)
        .send({ error: false, data: { task: response.rows[0] } });
    } catch (err) {
      return res.status(500).send({ error: true, data: err });
    }
  }
}
