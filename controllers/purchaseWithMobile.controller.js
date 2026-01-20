import Mobile from "../models/mobileModel.js"
import Purchase from "../models/purchaseModel.js"
import { createPurchaseWithMobile } from "../services/createPurchaseWithMobile.service.js"
import { updatePurchaseWithMobileService } from "../services/updatePurchaseWithMobileservice.service.js"
import { getS3Objects } from "../utils/s3Config.js"

export const addPurchaseWithMobile = async (req, res) => {

    try {
        const addPurchase = await createPurchaseWithMobile(req)
        return res.status(200).json({ success: true, message: "Purchase With mobile added succesfully", data: addPurchase })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const getAllPurchaseWithMobile = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        const skip = (page - 1) * limit;

        const pipeline = [
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
            }
        ];

        // Run paginated data + total count in parallel
        const [purchasesWithMobile, totalCount] = await Promise.all([
            Purchase.aggregate([
                ...pipeline,
                { $sort: { createdAt: -1 } },   // optional but recommended
                { $skip: skip },
                { $limit: limit }
            ]),
            Purchase.aggregate([
                ...pipeline,
                { $count: "count" }
            ])
        ]);

        const total = totalCount[0]?.count || 0;
        const totalPages = Math.ceil(total / limit);

        // Generate S3 signed URLs only for paginated results
        const response = await Promise.all(
            purchasesWithMobile.map(async (purchase) => {
                const p = { ...purchase };

                // Purchase photos
                p.vendorPhoto = await getS3Objects(p.vendorPhoto);
                p.vendorDocumentPhoto = await getS3Objects(p.vendorDocumentPhoto);
                p.billPhoto = await getS3Objects(p.billPhoto);

                // Mobile photos
                if (p.mobile) {
                    p.mobile.mobilePhoto = await getS3Objects(p.mobile.mobilePhoto);
                }

                return p;
            })
        );

        return res.status(200).json({
            success: true,
            message: response.length ? "Stock fetched successfully" : "No stock found",
            pagination: {
                totalRecords: total,
                totalPages,
                currentPage: page,
                limit
            },
            data: response
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const updatePurchaseWithMobile = async (req, res) => {

    try {
        const addPurchase = await updatePurchaseWithMobileService(req)
        return res.status(200).json({ success: true, message: "Purchase With mobile added succesfully", data: addPurchase })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }


};