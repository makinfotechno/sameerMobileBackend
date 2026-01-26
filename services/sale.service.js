import mongoose from "mongoose";
import Mobile from "../models/mobileModel.js";
import Sale from "../models/saleModel.js"

export const createSale = async (saleData) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        const { purchaseId } = saleData;

        const mobileUpdate = await Mobile.findOneAndUpdate(
            { purchaseId, status: { $ne: "soldOut" } },
            { status: "soldOut" },
            { new: true, runValidators: true, session }
        );
        if (!mobileUpdate) {
            throw new Error("Mobile not found or already sold out");
        }
        const saleAddData = await Sale.create([saleData], {session});
        if (!saleAddData) {
            throw new Error("Error while adding purchase")
        }


        session.commitTransaction();
        return { mobileUpdate, saleAddData: saleAddData[0] }

    } catch (error) {
        session.abortTransaction();
        throw new Error(error.message);
    }

}

export const deleteSaleByID = async (id) => {

    const saleData = await Sale.findByIdAndDelete(id)
    if (!saleData) {
        throw new Error("Error while Deleting sale")
    }
    return saleData
}

export const updateSaleByID = async (id, updateData) => {

    const saleData = await Sale.findByIdAndUpdate(
        id, { $set: updateData }, { new: true, runValidators: true }
    );

    if (!saleData) {
        throw new Error("Sale not found");
    }

    return saleData;
}

export const getAllSale = async () => {
    const allSaleData = await Sale.find()
    if (allSaleData.length === 0) {
        return []
    }
    return allSaleData
}

export const getSale = async (id) => {
    const saleData = await Sale.findById(id)
    if (!saleData) {
        throw new Error("Requested sale data not found")
    }
    return saleData
}
