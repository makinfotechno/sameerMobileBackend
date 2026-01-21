import { Router } from "express";
import { postMobile, allMobile, deleteMobile, updateMobile, getMobileById } from "../controllers/mobile.controller.js";
import { getSellDetailsController } from "../controllers/getSellDetails.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router()


router.get('/', allMobile)
router.get('/:id', authMiddleware, getMobileById)
router.post('/', authMiddleware, postMobile)
router.delete('/:id', authMiddleware, deleteMobile)
router.put('/:id', authMiddleware, updateMobile)
router.get("/:id/sell-details", getSellDetailsController);



export default router