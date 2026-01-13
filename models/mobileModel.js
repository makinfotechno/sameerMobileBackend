import mongoose from "mongoose";

const mobileModel = new mongoose.Schema(
    {
        purchaseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Purchase',
            required: true,
            unique: true,
            index: true
        },
        brand: {
            type: String,
            required: true
        },
        model: {
            type: String,
            required: true
        },
        imei: {
            type: String,
            unique: true,
            required: true
        },
        storage: {
            type: String,
        },
        ram: {
            type: String,
        },
        color: {
            type: String,
        },
        condition: {
            type: String,
            enum: ['Like new', 'Minor scratches', 'Visible dent', 'Damaged']
        },
        status: {
            type: String,
            enum: ['Instock', 'SoldOut'],
            default: "Instock"
        },
        hasBox: {
            type: Boolean,
        },
        hasCharger: {
            type: Boolean,
        },
        mobilePhoto: {
            type: [String],
            default: []
        }
    },
    { timestamps: true }
)

const Mobile = mongoose.model("Mobile", mobileModel)

export default Mobile