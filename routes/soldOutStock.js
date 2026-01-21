import { Router } from "express";
import { getSoldOutStock } from "../controllers/getSoldOutStock.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
 
const router = Router() 
 
router.get('/', authMiddleware, getSoldOutStock)
 

export default router