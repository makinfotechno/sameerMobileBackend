import { Router } from "express";
import { postSale, allSales, deleteSale, updateSale, sale } from "../controllers/sale.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router()

router.get('/:id', authMiddleware, sale)
router.get('/', authMiddleware, allSales)
router.post('/', authMiddleware, postSale)
router.delete('/:id', authMiddleware, deleteSale)
router.put('/:id', authMiddleware, updateSale)


export default router


