import express, { Application } from "express";
import cors from "cors";

const app: Application = express();

//settings
app.set("port", process.env.PORT || 3001);

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use("/api/hello", (req, res) => res.send("Hello World!"));


export default app;
