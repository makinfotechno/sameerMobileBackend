import Sale from "../models/saleModel.js"

export const createSale = async (saleData) => {
    const saleAddData = await Sale.create(saleData)
    if (!saleAddData) {
        throw new Error("Error while adding purchase")
    }
    return saleAddData
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
