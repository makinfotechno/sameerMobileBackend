import Purchase from "../models/purchaseModel.js"
import { createPurchaseWithMobile, getPurchaseWithMobileService, updatePurchaseWithMobileService } from "../services/purchaseWithMobile.service.js"
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
        const search = req.query.q?.trim();
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        const skip = (page - 1) * limit;

        const matchStage = search
            ? {
                $or: [
                    { "mobile.model": { $regex: search, $options: "i" } },
                    { "mobile.brand": { $regex: search, $options: "i" } }
                ]
            }
            : {};

        const allPurchaseWithMobileCount = await Purchase.countDocuments();
        const result = await Purchase.aggregate([
            {
                $lookup: {
                    from: "mobiles",
                    localField: "_id",
                    foreignField: "purchaseId",
                    as: "mobile"
                }
            },
            { $unwind: { path: "$mobile", preserveNullAndEmptyArrays: true } },
            { $match: matchStage },
            {
                $facet: {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    totalCount: [
                        { $count: "count" }
                    ],
                    stats: [
                        {
                            $group: {
                                _id: null,
                                stock: {
                                    $sum: {
                                        $cond: [{ $eq: ["$mobile.status", "inStock"] }, 1, 0]
                                    }
                                },
                                sales: {
                                    $sum: {
                                        $cond: [{ $eq: ["$mobile.status", "soldOut"] }, 1, 0]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ]);

        const purchasesWithMobile = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;
        const stock = result[0].stats[0]?.stock || 0;
        const sales = result[0].stats[0]?.sales || 0;

        const totalPages = Math.ceil(total / limit);

        // Generate S3 signed URLs only for paginated results ...
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
                totalRecords: allPurchaseWithMobileCount,
                totalPages,
                currentPage: page,
                limit,
                stock,
                sales
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

export const getPurchaseWithMobile = async (req, res) => {
  try {
    const data = await getPurchaseWithMobileService(req.params.purchaseId);

    return res.status(200).json({
      success: true,
      message: "Purchase fetched successfully",
      data
    });
  } catch (error) {
    return res.status(400).json({
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