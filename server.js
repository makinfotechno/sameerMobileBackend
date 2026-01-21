import express from 'express'
import cors from 'cors'
import userRouter from "./routes/user.route.js"
import purchaseRoute from "./routes/purchase.js"
import salesRoute from "./routes/sale.js"
import mobileRoute from "./routes/mobile.js"
import { connectdb } from './config/db.js'
import { configDotenv } from "dotenv";
import purchaseWithMobileRoute from "./routes/purchaseWithMobile.js"
import stock from "./routes/stock.js"
import soldOutstock from "./routes/soldOutStock.js"
const app = express()


app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(cors())
configDotenv()

const PORT = process.env.PORT || 5000

app.get("/", (req, res) => { res.send("Sameer Mobile Backend running") })

app.use("/v1/api/user", userRouter)
app.use("/v1/api/purchase", purchaseRoute)
app.use("/v1/api/sale", salesRoute)
app.use("/v1/api/mobile", mobileRoute)
app.use("/v1/api/purchaseWithMobile", purchaseWithMobileRoute)
app.use("/v1/api/stock", stock)
app.use("/v1/api/soldOutStock", soldOutstock)

async function startServer() {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
    });

    try {
        await connectdb();
        console.log("Database connected");
    } catch (err) {
        console.error("DB connection failed:", err);
    }
}


startServer();