import bcrypt from "bcryptjs"
import User from "../models/userModel.js"

const registerUser = async (req, res) => {
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

export default registerUser
