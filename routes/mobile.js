import { Router } from "express";
import { postMobile, allMobile, deleteMobile, updateMobile, getMobileById } from "../controllers/mobile.controller.js";
import { getSellDetailsController } from "../controllers/getSellDetails.controller.js";

const router = Router()


router.get('/', allMobile)
router.get('/:id', getMobileById)
router.post('/', postMobile)
router.delete('/:id', deleteMobile)
router.put('/:id', updateMobile)
router.get("/:id/sell-details", getSellDetailsController);



export default router