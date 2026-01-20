import { Router } from "express";
import { getAllStock } from "../controllers/getAllStock.controller.js";

const router = Router()

router.get('/', getAllStock)


export default router