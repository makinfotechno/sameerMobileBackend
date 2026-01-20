import { Router } from "express";
import { getSoldOutStock } from "../controllers/getSoldOutStock.controller.js";
 
const router = Router() 
 
router.get('/', getSoldOutStock)
 

export default router