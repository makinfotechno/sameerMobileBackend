import bcrypt from "bcryptjs"
import User from "../models/userModel.js"

const registerUser = async (req, res) => {
    try {
        const { mobile, mPin } = req.body

        if (!mobile || !mPin) {
            return res.status(400).json({ message: "mobile & mPin required" })
        }

        const existingUser = await User.findOne()
        if (existingUser) {
            return res.status(400).json({ message: "Please login with registered mobile number and mPin" })
        }

        const hashedPin = await bcrypt.hash(mPin, 10)

        const user = await User.create({
            mobile,
            mPin: hashedPin
        })

        return res.status(201).json({
            success: true,
            message: "Single user created",
            data: {
                id: user._id,
                mobile: user.mobile
            }
        })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export default registerUser
