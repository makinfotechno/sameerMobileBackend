import { Router } from "express";
import { postPurchase, allPurchase, deletePurchase, updatePurchase } from "../controllers/purchase.controller.js";

const router = Router()


router.get('/', allPurchase)
router.post('/', postPurchase)
router.delete('/:id', deletePurchase)
router.put('/:id', updatePurchase)


export default router