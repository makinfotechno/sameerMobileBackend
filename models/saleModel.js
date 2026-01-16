import mongoose from "mongoose";

const customer = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            trim: true
        }

    },
    { _id: false })

const saleModel = new mongoose.Schema(
    {
        purchaseId: {
            type: String,
            required: true,
            index: true
        },
        sellingPrice: {
            type: String,
            required: true
        },
        profit: {
            type: String,
        },
        customer: customer
    },
    { timestamps: true }
)

const Sale = mongoose.model("Sale", saleModel)

export default Sale