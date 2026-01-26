import User from "../models/userModel.js"


export const getUser = async (req, res) => {

    try {
        const { userId } = req.body
        if (!userId) return res.status(400).json({ success: false, message: "userId required" })

        const user = await User.findById(userId)
        if (!user) return res.status(400).json({ success: false, message: "user not found" })

        return res.status(200).json({ success: true, message: "user data fetched successfully", data: user })
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.userId;

        const { ownerName, shopName, adress, city, mobile, mPin } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (ownerName) user.ownerName = ownerName;
        if (shopName) user.shopName = shopName;
        if (adress) user.adress = adress;
        if (city) user.city = city;
        if (mobile) user.mobile = mobile;

        if (mPin) {
            const hashedPin = await bcrypt.hash(mPin, 10);
            user.mPin = hashedPin;
        }

        await user.save();

        return res.json({
            success: true,
            message: "User updated successfully",
            data: user
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

