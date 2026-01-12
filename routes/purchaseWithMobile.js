import { Router } from "express";
import { purchaseWithMobile } from "../controllers/purchaseWithMobile.controller.js";
const router = Router()

router.post('/', purchaseWithMobile)
 


export default router