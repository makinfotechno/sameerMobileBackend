import Purchase from "../models/purchaseModel.js"

const createPurchase = async (payload) => {
    const purchaseData = await Purchase.create(payload)
    if (!purchaseData) {
        throw new Error("Error while adding purchase")
    }
    return purchaseData
}


export const getAllPurchase = async () => {
    const allPurchaseData = await Purchase.find()
    if (!allPurchaseData) {
        throw new Error("Error while adding purchase")
    }
    return allPurchaseData
}

export default createPurchase