import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import generateContract from "../controllers/generatePdfContract.controller.js";
 
const router = Router()

router.post('/:purchaseId', authMiddleware, generateContract)
 

export default router