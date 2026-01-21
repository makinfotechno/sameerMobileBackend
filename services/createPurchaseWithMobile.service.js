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
        let purchaseRes = await createPurchase(purchase, session)

        const purchaseId = purchaseRes[0]._id.toString();

        let mobileRes = await createMobile({ ...mobile, purchaseId }, session)

        await session.commitTransaction();

        for (const file of files) {

            const Spkey = `${purchaseId}/${randomUUID()}${file.originalname}`;

            if (file.fieldname === "mobilePhoto") {
                await uploadS3Object(file, Spkey, "mobile")
                mobileRes = await updateMobileByID(mobileRes[0]._id, {
                    [file.fieldname]: `mobile/${Spkey}`
                }, session);

            } else {
                await uploadS3Object(file, Spkey, "purchase")
                purchaseRes = await updatePurchaseByID(purchaseId, {
                    [file.fieldname]: `purchase/${Spkey}`
                }, session);
            }
        }
        return {
            purchase: purchaseRes,
            mobile: mobileRes,
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