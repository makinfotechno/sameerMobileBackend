import mongoose from "mongoose";
import Purchase from "../models/purchaseModel.js";
import Mobile from "../models/mobileModel.js";
import { deleteS3Object, uploadS3Object } from "../utils/s3Config.js";
import { randomUUID } from "crypto";

export const updatePurchaseWithMobileService = async (req) => {
    const { purchaseId } = req.params;

    const purchase =
        req.body.purchase ? JSON.parse(req.body.purchase) : {};

    const mobile =
        req.body.mobile ? JSON.parse(req.body.mobile) : {};

    const files = Object.values(req.files || {}).flat();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let purchaseRes = await Purchase.findByIdAndUpdate(
            purchaseId,
            purchase,
            { new: true, session }
        );

        if (!purchaseRes) {
            throw new Error("Purchase not found");
        }

        let mobileRes = await Mobile.findOneAndUpdate(
            { purchaseId },
            mobile,
            { new: true, session }
        );

        if (!mobileRes) {
            throw new Error("Mobile not found");
        }

        for (const file of files) {
            const s3Key = `${purchaseId}/${randomUUID()}${file.originalname}`;

            if (file.fieldname === "mobilePhoto") {
                const oldKey = mobileRes.mobilePhoto;

                await uploadS3Object(file, s3Key, "mobile");

                mobileRes = await Mobile.findByIdAndUpdate(
                    mobileRes._id,
                    { mobilePhoto: `mobile/${s3Key}` },
                    { new: true, session }
                );

                await deleteS3Object(oldKey);
            }
            else if (["vendorPhoto", "vendorDocumentPhoto", "billPhoto", "agreementPhoto"].includes(file.fieldname)) {

                const oldKey = purchaseRes[file.fieldname];
                await uploadS3Object(file, s3Key, "purchase");

                purchaseRes = await Purchase.findByIdAndUpdate(
                    purchaseId,
                    { [file.fieldname]: `purchase/${s3Key}` },
                    { new: true, session }
                );

                await deleteS3Object(oldKey);
            }
        }

        await session.commitTransaction();

        return {
            purchase: purchaseRes,
            mobile: mobileRes
        };

    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        throw error;
    } finally {
        session.endSession();
    }
};
