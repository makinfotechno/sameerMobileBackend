import mongoose from "mongoose"
import { createMobile, updateMobileByID } from "./mobile.service.js"
import { createPurchase, updatePurchaseByID } from "./purchase.service.js"
import { uploadS3 } from "../utils/uploadS3.js";


// post text and get purchase id - 

export const createPurchaseWithMobile = async (req) => {

    const purchase = JSON.parse(req.body.purchase);
    const mobile = JSON.parse(req.body.mobile);

    const files = Object.values(req.files).flat();

    // console.log(files, 'filesllllllllll')

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


            if (file.fieldname === "mobilePhotos") {
                await uploadS3(file, purchaseId, "mobile")
                console.log('mobilePhotos runnsssss', file.fieldname)
                mobilewiths3keys = await updateMobileByID(mobileRes[0]._id, {
                    [file.fieldname]: `mobile/${purchaseId}/${file.originalname}`
                }, session);

            } else {
                await uploadS3(file, purchaseId, "purchase")
                console.log('purchasewiths3keys runnsssss', file.fieldname)
                purchasewiths3keys = await updatePurchaseByID(purchaseId, {
                    [file.fieldname]: `purchase/${purchaseId}/${file.originalname}`
                }, session);
            }
        }
        // console.log(purchasewiths3keys, mobilewiths3keys, 'dataWithKeyssss')

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