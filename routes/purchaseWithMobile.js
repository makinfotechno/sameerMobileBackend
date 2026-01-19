import { Router } from "express";
import { getAllPurchaseWithMobile, purchaseWithMobile } from "../controllers/purchaseWithMobile.controller.js";
import upload from "../utils/multer.js";
const router = Router()

router.post('/',  upload.fields([
    { name: "vendorPhoto", maxCount: 1 },
    { name: "vendorDocumentPhoto", maxCount: 1 },
    { name: "billPhoto", maxCount: 1 },
    { name: "mobilePhoto", maxCount: 1}
  ]), purchaseWithMobile)
 
router.get('/', getAllPurchaseWithMobile)
 


export default router