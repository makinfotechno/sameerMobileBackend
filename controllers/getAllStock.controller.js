import Purchase from "../models/purchaseModel.js";
import { getS3Objects } from "../utils/s3Config.js";

export const getAllStock = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const aggregationPipeline = [
      {
        $lookup: {
          from: "mobiles",
          localField: "_id",
          foreignField: "purchaseId",
          as: "mobile"
        }
      },
      {
        $unwind: "$mobile"
      },
      {
        $match: {
          "mobile.status": "Instock"
        }
      }
    ];

    // Run count & data query in parallel
    const [stock, totalCount] = await Promise.all([
      Purchase.aggregate([
        ...aggregationPipeline,
        { $skip: skip },
        { $limit: limit }
      ]),
      Purchase.aggregate([
        ...aggregationPipeline,
        { $count: "count" }
      ])
    ]);

    const total = totalCount[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    const response = await Promise.all(
      stock.map(async (purchase) => {
        const p = { ...purchase };

        p.vendorPhoto = await getS3Objects(p.vendorPhoto);
        p.vendorDocumentPhoto = await getS3Objects(p.vendorDocumentPhoto);
        p.billPhoto = await getS3Objects(p.billPhoto);

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
