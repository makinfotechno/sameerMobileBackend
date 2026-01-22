import { Router } from "express";
import { registerUser, loginUser, updateUser, logOutUser } from "../controllers/user.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/", registerUser)
router.get("/", loginUser)
router.put("/", authMiddleware, updateUser)
router.delete("/", authMiddleware, logOutUser)

export default router