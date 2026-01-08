import { Router } from "express";

const router = Router()

router.get("/", (req,res)=> {
    req.send('Hitting mobile routes')

})


export default router