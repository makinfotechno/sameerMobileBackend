import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^[6-9]\d{9}$/, "Invalid Indian mobile number"]
    },
    mPin: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema)

export default User