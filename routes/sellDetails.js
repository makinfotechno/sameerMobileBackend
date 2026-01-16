import { Router } from "express";
import { getSellDetailsController } from "../controllers/getSellDetails.controller.js";

const router = Router()

router.get("/", getSellDetailsController);

export default router