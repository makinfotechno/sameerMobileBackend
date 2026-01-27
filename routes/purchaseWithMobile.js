import { Router } from "express";
import { getAllPurchaseWithMobile, addPurchaseWithMobile, updatePurchaseWithMobile, getPurchaseWithMobile } from "../controllers/purchaseWithMobile.controller.js";
import upload from "../utils/multer.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = Router()

router.get('/', authMiddleware, getAllPurchaseWithMobile)

router.get('/:purchaseId', authMiddleware, getPurchaseWithMobile)

router.post('/', upload.fields([
  { name: "vendorPhoto", maxCount: 1 },
  { name: "vendorDocumentPhoto", maxCount: 1 },
  { name: "billPhoto", maxCount: 1 },
  { name: "mobilePhoto", maxCount: 1 },
  { name: "agreementPhoto", maxCount: 1 }
]), authMiddleware, addPurchaseWithMobile)

router.put('/:purchaseId', upload.fields([
  { name: "vendorPhoto", maxCount: 1 },
  { name: "vendorDocumentPhoto", maxCount: 1 },
  { name: "billPhoto", maxCount: 1 },
  { name: "mobilePhoto", maxCount: 1 },
  { name: "agreementPhoto", maxCount: 1 }
]), authMiddleware, updatePurchaseWithMobile)



export default router