import { createSale, deleteSaleByID, getAllSale, updateSaleByID, getSale } from "../services/sale.service.js"

export const postSale = async (req, res) => {

    try {
        const { sellingPrice, customer } = req.body
        if (!sellingPrice || !customer.name || !customer.phone) {
            return res.status(400).json({ success: false, message: "Please provide all Customer details includeing name, phone and selling price" })
        }
        const data = await createSale(req.body)

        return res.status(200).json({ success: true, message: "Sale added succesfully", data })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const deleteSale = async (req, res) => {

    try {
        const { id } = req.params
        console.log(id, 'id')

        const data = await deleteSaleByID(id)

        return res.status(200).json({ success: true, message: "Sale deleted succesfully", data })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const updateSale = async (req, res) => {

    try {
        const { id } = req.params
        const updateData = req.body
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Sale ID is required"
            });
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No Sale data provided to update"
            });
        }

        const data = await updateSaleByID(id, updateData)

        return res.status(200).json({ success: true, message: "Sale updated succesfully", data })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const allSales = async (req, res) => {
    try {
        const data = await getAllSale()

        return res.status(200).json({ success: true, message: "Sale fetched successfully", data })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}
export const sale = async (req, res) => {
    try {
        const { id } = req.params
        const data = await getSale(id)

        return res.status(200).json({ success: true, message: "Sale fetched successfully", data })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}