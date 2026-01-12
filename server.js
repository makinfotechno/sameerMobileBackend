import express from 'express'
import cors from 'cors'
import userRouter from "./routes/user.route.js"
import purchaseRoute from "./routes/purchase.js"
import salesRoute from "./routes/sale.js"
import mobileRoute from "./routes/mobile.js"
import { connectdb } from './config/db.js'
import { configDotenv } from "dotenv";
import purchaseWithMobileRoute from "./routes/purchaseWithMobile.js"

const app = express()

app.use(express.json())
app.use(cors())
configDotenv()

const PORT = process.env.PORT || 5000

app.get("/", (req, res) => {
    res.send("Backend running")
})

app.use("/v1/api/user", userRouter)
app.use("/v1/api/purchase", purchaseRoute)
app.use("/v1/api/sale", salesRoute)
app.use("/v1/api/mobile", mobileRoute)
app.use("/v1/api/purchaseWithMobile", purchaseWithMobileRoute)

async function startServer() {
    await connectdb();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();