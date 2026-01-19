import { createPurchaseWithMobile } from "../services/createPurchaseWithMobile.service.js"

export const purchaseWithMobile = async (req, res) => {
 
    try {
 
        const addPurchase = await createPurchaseWithMobile(req)
        return res.status(200).json({ success: true, message: "Purchase With mobile added succesfully", data: addPurchase })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}