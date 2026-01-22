import User from "../models/userModel.js";

export const getProfile = async (req, res) => {
    try {
        const userId = req.userId;     

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            success: true,
            message: "Profile Data Fetched successfully",
            data: user
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};