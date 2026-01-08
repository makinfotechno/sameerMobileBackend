import { Router } from "express";
import postPurchase, { allPurchase } from "../controllers/purchase.controller.js";

const router = Router()


router.get('/', allPurchase)
router.post('/', postPurchase)
 

export default router