import bcrypt from "bcryptjs"
import User from "../models/user.model.js"

const createUserService = async ({ mobile, mPin }) => {
    const existingUser = await User.findOne({ mobile })
    if (existingUser) {
        throw new Error("User already exists")
    }

    const hashedPin = await bcrypt.hash(mPin, 10)

    const user = await User.create({
        mobile,
        mPin: hashedPin
    })

    return user
}

export default createUserService
