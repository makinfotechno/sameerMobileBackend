import createPurchase, { getAllPurchase } from "../services/purchase.service.js"

export const postPurchase = async (req, res) => {

    try {
        const { vendorName, mobileNumber, purchasePrice } = req.body

        if (!vendorName || !mobileNumber || !purchasePrice) {
            return res.status(400).json({ success: false, message: "Please provide all vendor details" })
        }

        const addPurchase = await createPurchase(req.body)

        return res.status(200).json({ success: true, message: "Purchase added succesfully", data: addPurchase })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}


export const allPurchase = async (req,res) => {

    try {
        const allPurchase = await getAllPurchase()

        return res.status(200).json({ success: true, message: "Purchases fetched successfully", data: allPurchase })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

 