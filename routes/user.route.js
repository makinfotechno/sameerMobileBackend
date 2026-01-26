import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getUser, updateUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUser);
router.put("/", updateUser);

export default router;
