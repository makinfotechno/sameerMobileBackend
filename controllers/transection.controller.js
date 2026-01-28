import Transaction from "../models/transectionModel.js";

export const getRecentHistory = async (req, res) => {
    try {
        const data = await Transaction.find()
            .sort({ createdAt: -1 })
            .limit(50)
            .populate("mobileId", "model storage ram color")
            .lean();

        return res.status(200).json({ success: true, message: "History data fetched successfully", data });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
