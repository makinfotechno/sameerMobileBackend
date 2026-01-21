import { Router } from "express";
import { postPurchase, allPurchase, deletePurchase, updatePurchase, purchase } from "../controllers/purchase.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router()

router.get('/:id', purchase)
router.get('/', authMiddleware, allPurchase)
router.post('/', authMiddleware, postPurchase)
router.delete('/:id', authMiddleware, deletePurchase)
router.put('/:id', authMiddleware, updatePurchase)


export default router