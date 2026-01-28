import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  mobileId: {
    type: String,
    required: true,
    index: true
  },

  purchaseId: {
    type: String,
    ref: "Purchase",
    required: true,
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

  storage: {
    type: String
  },
  ram: {
    type: String
  },
  color: {
    type: String
  },

  type: {
    type: String,
    enum: ["inStock", "soldOut"], // inStock = purchase, soldOut = sale
    required: true,
    index: true
  },

  amount: {
    type: Number,
    required: true
  },

  customer: {
    name: String,
    phone: String
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});


const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;