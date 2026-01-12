import Purchase from "../models/purchaseModel.js"

const createPurchase = async ( purchase, session ) => {
    const purchaseData = await Purchase.create([purchase], { session })
    if (!purchaseData) {
        throw new Error("Error while adding purchase")
    }
    return purchaseData
}

export const deletePurchaseByID = async (id) => {

    const purchaseData = await Purchase.findByIdAndDelete(id)
    if (!purchaseData) {
        throw new Error("Error while adding purchase")
    }
    return purchaseData
}

export const updatePurchaseByID = async (id, updateData) => {

    const purchaseData = await Purchase.findByIdAndUpdate(
        id, { $set: updateData }, { new: true, runValidators: true }
    );

    if (!purchaseData) {
        throw new Error("Purchase not found");
    }

    return purchaseData;
}

export const getAllPurchase = async () => {
    const allPurchaseData = await Purchase.find()
    if (allPurchaseData.length === 0) {
        return []
    }
    return allPurchaseData
}

export default createPurchase