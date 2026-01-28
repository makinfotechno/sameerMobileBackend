import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    ownerName: {
        type: String,
        required: true,
        trim: true,
        default: "Sameer Bhai",
    },
    shopName: {
        type: String,
        required: true,
        trim: true,
        default: "Sameer Mobile Shop",
    },
    adress: {
        type: String,
        required: true,
        trim: true,
        default: "3, Under Shakti Cinema, Nr. HDFC Bank, Halvad-363330, Dist. Morbi (Guj.)",
    },
    city: {
        type: String,
        required: true,
        trim: true,
        default: "Halvad",
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
        trim: true,
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema)

export default User