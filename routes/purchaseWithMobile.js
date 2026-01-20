import { Router } from "express";
import { getAllPurchaseWithMobile, addPurchaseWithMobile, updatePurchaseWithMobile } from "../controllers/purchaseWithMobile.controller.js";
import upload from "../utils/multer.js";
const router = Router()

router.post('/', upload.fields([
  { name: "vendorPhoto", maxCount: 1 },
  { name: "vendorDocumentPhoto", maxCount: 1 },
  { name: "billPhoto", maxCount: 1 },
  { name: "mobilePhoto", maxCount: 1 },
  { name: "agreementPhoto", maxCount: 1 }
]), addPurchaseWithMobile)

router.get('/', getAllPurchaseWithMobile)

router.put('/:purchaseId', upload.fields([
  { name: "vendorPhoto", maxCount: 1 },
  { name: "vendorDocumentPhoto", maxCount: 1 },
  { name: "billPhoto", maxCount: 1 },
  { name: "mobilePhoto", maxCount: 1 },
  { name: "agreementPhoto", maxCount: 1 }
]), updatePurchaseWithMobile)



export default router