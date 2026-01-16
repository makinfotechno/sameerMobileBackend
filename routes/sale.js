import { Router } from "express";
import { postSale, allSales, deleteSale, updateSale, sale } from "../controllers/sale.controller.js";

const router = Router()

router.get('/:id', sale)
router.get('/', allSales)
router.post('/', postSale)
router.delete('/:id', deleteSale)
router.put('/:id', updateSale)


export default router


