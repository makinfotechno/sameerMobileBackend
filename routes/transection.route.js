import { Router } from "express";
import { getRecentHistory } from "../controllers/transection.controller.js";

const router = Router();
router.get("/", getRecentHistory);

export default router;