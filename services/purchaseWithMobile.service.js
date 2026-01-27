import mongoose from "mongoose"
import { createMobile, updateMobileByID } from "./mobile.service.js"
import { createPurchase, updatePurchaseByID } from "./purchase.service.js"
import Purchase from "../models/purchaseModel.js";
import Mobile from "../models/mobileModel.js";
import { deleteS3Object, uploadS3Object } from "../utils/s3Config.js";
import { randomUUID } from "crypto";
import { getS3Objects } from "../utils/s3Config.js";

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

export const getPurchaseWithMobileAndSaleService = async (purchaseId) => {
    if (!mongoose.Types.ObjectId.isValid(purchaseId)) {
        throw new Error("Invalid purchaseId");
    }

    const result = await Purchase.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(purchaseId) }
        },

        {
            $lookup: {
                from: "mobiles",
                localField: "_id",
                foreignField: "purchaseId",
                as: "mobile"
            }
        },
        {
            $unwind: {
                path: "$mobile",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "sales",
                let: { purchaseId: { $toString: "$_id" } },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$purchaseId", "$$purchaseId"] }
                        }
                    },
                    {
                        $project: {
                            purchaseId: 1,
                            sellingPrice: 1,
                            profit: 1,
                            customer: 1,
                            createdAt: 1
                        }
                    }
                ],
                as: "sale"
            }
        },
        {
            $unwind: {
                path: "$sale",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                sale: { $ifNull: ["$sale", {}] }
            }
        }
    ]);

    if (!result.length) {
        throw new Error("Purchase not found");
    }

    const p = result[0];

    p.vendorPhoto = await getS3Objects(p.vendorPhoto);
    p.vendorDocumentPhoto = await getS3Objects(p.vendorDocumentPhoto);
    p.billPhoto = await getS3Objects(p.billPhoto);

    if (p.mobile?.mobilePhoto) {
        p.mobile.mobilePhoto = await getS3Objects(p.mobile.mobilePhoto);
    }

    return p;
};
