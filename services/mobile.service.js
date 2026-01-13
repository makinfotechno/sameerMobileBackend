import Mobile from "../models/mobileModel.js"

export const createMobile = async (mobile, session) => {
    const mobileData = await Mobile.create([mobile], { session })
    if (!mobileData) {
        throw new Error("Error while adding mobile")
    }
    return mobileData
}

export const deleteMobileByID = async (id) => {

    const mobileData = await Mobile.findByIdAndDelete(id)
    if (!mobileData) {
        throw new Error("Error while deleting mobile")
    }
    return mobileData
}

export const mobileByID = async (id) => {

    const mobileData = await Mobile.findById(id)
    if (!mobileData) {
        throw new Error("Error while finding mobile")
    }
    return mobileData
}

export const updateMobileByID = async (id, updateData) => {

    const Data = await Mobile.findByIdAndUpdate(
        id, { $set: updateData }, { new: true, runValidators: true }
    );

    if (!Data) {
        throw new Error("Mobile Data not found");
    }

    return Data;
}

export const getAllMobile = async () => {
    const allMobileData = await Mobile.find()
    if (allMobileData.length === 0) {
        return []
    }
    return allMobileData
}

