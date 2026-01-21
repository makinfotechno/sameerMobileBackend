import bcrypt from "bcryptjs"
import User from "../models/userModel.js"
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {
    try {
        const { ownerName, shopName, adress, city, mobile, mPin } = req.body

        if (!mobile || !mPin || !ownerName || !shopName || !adress || !city) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await User.findOne()
        if (existingUser) {
            return res.status(400).json({ message: "Please login with registered mobile number and mPin" })
        }

        const hashedPin = await bcrypt.hash(mPin, 10)

        const user = await User.create({
            ownerName,
            shopName,
            adress,
            city,
            mobile,
            mPin: hashedPin
        })

        return res.status(201).json({
            success: true,
            message: "Owner registered successfully",
            data: user
        })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { mobile, mPin } = req.query;

        if (!mobile || !mPin) {
            return res.status(400).json({ message: "mobile & mPin required" })
        }

        const user = await User.findOne()
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (mobile !== user.mobile) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const isValidPin = await bcrypt.compare(mPin, user.mPin)
        if (!isValidPin) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" })

        return res.json({ success: true, message: "Login successful", data: { token, user } })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const updateUser = async (req, res) => {
    console.log(req, 'updateUser........')
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
