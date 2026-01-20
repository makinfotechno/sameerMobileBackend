import { Router } from "express";
import registerUser from "../controllers/createUser.controller.js"
import loginUser from "../controllers/login.controller.js";

const router = Router()

router.post("/", registerUser)
router.get("/", loginUser)

export default router