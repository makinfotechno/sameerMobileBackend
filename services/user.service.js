import User from "../models/userModel.js"


const createUserService = async ({ name, mobile }) => {

    const mobExist = await User.findOne({ mobile })
    if (mobExist) {
        throw new Error("User already exists")
    }
    const newUser = await User.create({ name, mobile })
    return newUser
}

export default createUserService