import { Router } from "express";
import {registerUser, loginUser } from "../controllers/user.controller.js"
 
const router = Router()

router.post("/", registerUser)
router.put("/", loginUser)

export default router