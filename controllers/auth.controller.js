import bcrypt from "bcryptjs"
import User from "../models/userModel.js"
import jwt from "jsonwebtoken"
import { generateAccessToken, generateRefreshToken, hashToken } from "../utils/helpers.js";
import refreshTokenModel from "../models/refreshTokenModel.js";

export const registerUser = async (req, res) => { // no provision for multiple users and registration only once from backend
    try {
        const { ownerName, shopName, adress, city, mobile, mPin } = req.body

        if (!mobile || !mPin || !ownerName || !shopName || !adress || !city) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await User.findOne()
        if (existingUser) {
            return res.status(400).json({ message: "User already registered. Please login with registered mobile number and mPin" })
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
        const { mobile, mPin } = req.body;
        if (!mobile || !mPin) {
            return res.status(400).json({ message: "mobile & mPin required" });
        }

        const user = await User.findOne();

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        if (user.mobile !== mobile) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValidPin = await bcrypt.compare(mPin, user.mPin);
        if (!isValidPin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken();

        await refreshTokenModel.create({
            user: user._id,
            tokenHash: hashToken(refreshToken),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days,
            platform:"android"

        });

        return res.json({
            success: true,
            data: {
                accessToken,
                refreshToken, // mobile
                user
            }
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const logOutUser = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token required" });
    }

    await refreshTokenModel.updateOne(
        { tokenHash: hashToken(refreshToken) },
        { revoked: true }
    );

    return res.json({ success: true, message: "Logged out successfully" });
};

export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }

    const tokenDoc = await refreshTokenModel.findOne({
        tokenHash: hashToken(refreshToken),
        revoked: false,
        expiresAt: { $gt: new Date() }
    });

    if (!tokenDoc) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(tokenDoc.user);

    return res.json({ accessToken: newAccessToken });
};