import mongoose from "mongoose"
import { createMobile, updateMobileByID } from "./mobile.service.js"
import { createPurchase, updatePurchaseByID } from "./purchase.service.js"
import { uploadS3Object } from "../utils/s3Config.js";
import { randomUUID } from "crypto";

export const createPurchaseWithMobile = async (req) => {

    const purchase = JSON.parse(req.body.purchase);
    const mobile = JSON.parse(req.body.mobile);

    const files = Object.values(req.files).flat();

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const purchaseRes = await createPurchase(purchase, session)

        const purchaseId = purchaseRes[0]._id.toString();

        const mobileRes = await createMobile({
            ...mobile,
            purchaseId
        }, session)

        await session.commitTransaction();   

        let purchasewiths3keys = {}
        let mobilewiths3keys = {}

        for (const file of files) {
       
                const Spkey = `${purchaseId}/${randomUUID()}${file.originalname}`;

            if (file.fieldname === "mobilePhoto") {
                await uploadS3Object(file, Spkey, "mobile")
                mobilewiths3keys = await updateMobileByID(mobileRes[0]._id, {
                    [file.fieldname]: `mobile/${Spkey}`
                }, session);

            } else {
                await uploadS3Object(file, Spkey, "purchase")
                console.log('purchasewiths3keys runnsssss', file.fieldname)
                purchasewiths3keys = await updatePurchaseByID(purchaseId, {
                    [file.fieldname]: `purchase/${Spkey}`
                }, session);
            }
        }

        return {
            purchase: purchasewiths3keys,
            mobile: mobilewiths3keys,
        }

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        throw error;
    }
    finally {
        session.endSession();
    }

}