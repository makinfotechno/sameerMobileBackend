import { Router } from "express";
import { getAllStock } from "../controllers/getAllStock.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router()

router.get('/',authMiddleware, getAllStock)


export default router