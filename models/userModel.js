import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: 'Sameer Mobile'
    },
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
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // Note - allows multiple null values
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema)

export default User