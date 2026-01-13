import mongoose from "mongoose"
import { createMobile } from "./mobile.service.js"
import {createPurchase} from "./purchase.service.js"

export const createPurchaseWithMobile = async ({ purchase, mobile }) => {

    const session = await mongoose.startSession()
    session.startTransaction()
    try {

        const purchaseRes = await createPurchase(purchase, session)

        const mobileRes = await createMobile({
            ...mobile,
            purchaseId: purchaseRes[0]._id
        }, session)

        await session.commitTransaction();
        console.log(purchaseRes, mobileRes, "responses")
        return {
            purchase: purchaseRes,
            mobile: mobileRes
        }

    } catch (error) {
        await session.abortTransaction();
        throw error;

    } finally {
        session.endSession();
    }


}