import Purchase from "../models/purchaseModel.js";
import { getS3Objects } from "../utils/s3Config.js";

export const getSoldOutStock = async (req, res) => {

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    try {
        const result = await Purchase.aggregate([
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
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $match: {
                    "mobile.status": "SoldOut"
                }
            },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $skip: skip },
                        { $limit: limit }
                    ]
                }
            }
        ]);

        const stock = result[0]?.data || [];
        const total = result[0]?.metadata[0]?.total || 0;
        const totalPages = Math.ceil(total / limit);

        const response = await Promise.all(
            stock.map(async (purchase) => {
                const p = { ...purchase };

                p.vendorPhoto = await getS3Objects(p?.vendorPhoto);
                p.vendorDocumentPhoto = await getS3Objects(p?.vendorDocumentPhoto);
                p.billPhoto = await getS3Objects(p?.billPhoto);

                if (p.mobile) {
                    p.mobile.mobilePhoto = await getS3Objects(p.mobile.mobilePhoto);
                }

                return p;
            })
        );

        return res.status(200).json({
            success: true,
            message: response.length
                ? "SoldOut Stock fetched successfully"
                : "No SoldOut Stock Available",
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
