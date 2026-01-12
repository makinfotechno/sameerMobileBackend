import createPurchase, { deletePurchaseByID, getAllPurchase, updatePurchaseByID } from "../services/purchase.service.js"

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

export const deletePurchase = async (req, res) => {

    try {
        const { id } = req.params
        console.log(id, 'id')

        const delPurchase = await deletePurchaseByID(id)

        return res.status(200).json({ success: true, message: "Purchase deleted succesfully", data: delPurchase })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const updatePurchase = async (req, res) => {

    try {
        const { id } = req.params
        const updateData = req.body
        console.log(id, updateData, "updatedData")
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Purchase ID is required"
            });
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No update data provided"
            });
        }

        const newPurchase = await updatePurchaseByID(id, updateData)

        return res.status(200).json({ success: true, message: "Purchase updated succesfully", data: newPurchase })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const allPurchase = async (req, res) => {
    try {
        const allPurchase = await getAllPurchase()

        return res.status(200).json({ success: true, message: "Purchases fetched successfully", data: allPurchase })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}