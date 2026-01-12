import { createMobile, deleteMobileByID, getAllMobile, updateMobileByID } from "../services/mobile.service.js"

export const postMobile = async (req, res) => {
    try {
        const { brand, model, imei } = req.body
        if (!brand || !imei || !model) {
            return res.status(400).json({ success: false, message: "Please provide all mobile details" })
        }
        const addMobile = await createMobile(req.body)

        return res.status(200).json({ success: true, message: "Purchase added succesfully", data: addMobile })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const deleteMobile = async (req, res) => {
    try {
        const { id } = req.params

        const delMobile = await deleteMobileByID(id)

        return res.status(200).json({ success: true, message: "Mobile deleted succesfully", data: delMobile })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const updateMobile = async (req, res) => {

    try {
        const { id } = req.params
        const updateData = req.body
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Mobile ID is required"
            });
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No update data provided"
            });
        }

        const data = await updateMobileByID(id, updateData)

        return res.status(200).json({ success: true, message: "Mobile updated succesfully", data: data })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const allMobile = async (req, res) => {
    try {
        const allMobileData = await getAllMobile()

        return res.status(200).json({ success: true, message: "All mobile Data fetched successfully", data: allMobileData })

    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}