import mongoose from "mongoose";

const vendorDocuments = new mongoose.Schema(
    {
        adharCard: {
            type: String,
            trim: true
        },
        drivingLicense: {
            type: String,
            trim: true
        },
        panCard: {
            type: String,
            trim: true
        },
        // more ..............
    },
    { _id: false }
)

const purchaseModel = new mongoose.Schema(
    {
        vendorName: {
            type: String,
            required: true,
            trim: true,
        },
        mobileNumber: {
            type: String,
            required: true,
            trim: true,
            index: true
            // match: /^[6-9]\d{9}$/, for indian mobile no.
        },
        purchasePrice: {
            type: Number,
            reqired: true,
            min: 0,
        },
        vendorDocs: vendorDocuments,
        vendorPhoto: {
            type: [String],
            default: []
        },
        billPhoto: {
            type: [String],
            default: []
        },
        paymentMode: {
            type: String,
            enum: ["cash", "upi", "bank_transfer", "card"],
            required: true,
        },
        purchaseDate: {
            type: Date,
            default: Date.now,
        }
    },
    { timestamps: true }
)

const Purchase = mongoose.model("Purchase", purchaseModel)

export default Purchase