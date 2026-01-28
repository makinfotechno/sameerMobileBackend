import { Router } from "express";
import {
    registerUser,
    loginUser,
    refreshAccessToken,
    logOutUser
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", authMiddleware, logOutUser);

export default router;
