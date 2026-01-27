import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import generatePdfInvoice from "../controllers/generateInvoice.controller.js";

const router = Router()

router.post('/:purchaseId', authMiddleware, generatePdfInvoice)
 

export default router