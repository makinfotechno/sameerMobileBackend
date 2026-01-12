import { Router } from "express";
import { postMobile, allMobile, deleteMobile, updateMobile } from "../controllers/mobile.controller.js";

const router = Router()


router.get('/', allMobile)
router.post('/', postMobile)
router.delete('/:id', deleteMobile)
router.put('/:id', updateMobile)


export default router