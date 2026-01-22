import mongoose from "mongoose";

// const vendorDocuments = new mongoose.Schema(
//     {
//         adharCard: {
//             type: String,
//             trim: true
//         },
//         drivingLicense: {
//             type: String,
//             trim: true
//         },
//         voterId: {
//             type: String,
//             trim: true
//         },
//         passport: {
//             type: String,
//             trim: true
//         },
//     },
//     { _id: false }
// )

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
        vendorCity: {
            type: String,
            required: true,
            trim: true,
        },
        vendorAdress: {
            type: String,
            required: true,
            trim: true,
        },
        billNumber: {
            type: String,
            trim: true,
        },
        shopName: {
            type: String,
            trim: true,
            default: "Sameer Mobile"
        },
        purchasePrice: {
            type: Number,
            required: true,
            min: 0,
        },
        // vendorDocs: vendorDocuments,
        vendorDocument: {
            type: String,
            enum: ["adharCard", "drivingLicense", "voterId", "passport"]
        },
        vendorDocumentPhoto: {
            type: String,
        },
        vendorPhoto: {
            type: String,
        },
        hasOriginalBill: {
            type: Boolean,
        },
        billPhoto: {
            type: String,
        },
        agreementPhoto: {
            type: String,
        },
        paymentMode: {
            type: String,
            enum: ["cash", "upi", "bank_transfer", "card"],
            required: true,
        },
        purchaseDate: {
            type: Date,
            default: Date.now,
        },

    },
    { timestamps: true }
)

// purchaseModel.pre("validate", function () {
//     const docs = this.vendorDocs || {};
//     const hasAtLeastOneDoc = Object.values(docs).some(Boolean);

//     if (!hasAtLeastOneDoc) {
//         this.invalidate(
//             "vendorDocs",
//             "At least one vendor document is required"
//         );
//     }
// });



const Purchase = mongoose.model("Purchase", purchaseModel)

export default Purchase