import Purchase from "../models/purchaseModel.js"
import { createPurchaseWithMobile } from "../services/createPurchaseWithMobile.service.js"
import { getS3Objects } from "../utils/s3Config.js"

export const purchaseWithMobile = async (req, res) => {

    try {
        const addPurchase = await createPurchaseWithMobile(req)
        return res.status(200).json({ success: true, message: "Purchase With mobile added succesfully", data: addPurchase })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const getAllPurchaseWithMobile = async (req, res) => {

    try {
        const purchasesWithMobile = await Purchase.aggregate([
            {
                $lookup: {
                    from: "mobiles",          // MongoDB collection name
                    localField: "_id",        // Purchase._id
                    foreignField: "purchaseId",
                    as: "mobile"
                }
            },
            {
                $unwind: {
                    path: "$mobile",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        const response = await Promise.all(
            purchasesWithMobile.map(async (purchase) => {
                const p = { ...purchase };
                console.log(p.vendorPhoto, 'purchase...')
                // Purchase photos
                p.vendorPhoto = await getS3Objects(p?.vendorPhoto);
                p.vendorDocumentPhoto = await getS3Objects(p?.vendorDocumentPhoto);
                p.billPhoto = await getS3Objects(p?.billPhoto);

                // Mobile photos
                if (p.mobile) {
                    p.mobile.mobilePhoto = await getS3Objects(p.mobile.mobilePhoto);
                }
                return p;
            })
        );

        if (response.length === 0) {
            return res.status(200).json({ success: true, message: "No Purchase With mobile found", data: [] })
        }

        return res.status(200).json({ success: true, message: "All Purchase With mobile fetched successfully", data: response })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }

}