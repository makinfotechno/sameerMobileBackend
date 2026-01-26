import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getUser, updateUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/", authMiddleware, getUser);
router.put("/", authMiddleware, updateUser);

export default router;
