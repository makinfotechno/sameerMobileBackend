import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getProfile } from "../controllers/profile.controller.js";

const router = Router()

// router.post("/", registerUser)
router.get("/",authMiddleware, getProfile)
// router.put("/", authMiddleware, updateUser)
// router.delete("/", authMiddleware, logOutUser)

export default router