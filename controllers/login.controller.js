import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

const loginUser = async (req, res) => {
    try {
        const { mobile, mPin } = req.body

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

        return res.json({success: true,message: "Login successful", data: { token, user } })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export default loginUser
