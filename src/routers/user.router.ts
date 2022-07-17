import { Router } from "express";
import UserController from "../controllers/user.controller";

const router: Router = Router();

router.post("/", UserController.signUp);

export default router;