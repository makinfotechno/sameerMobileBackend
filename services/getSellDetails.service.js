import Mobile from "../models/mobileModel.js";
import Purchase from "../models/purchaseModel.js";

export const getSellDetails = async (mobileId) => {
  const mobile = await Mobile.findById(mobileId);
  if (!mobile) throw new Error("Mobile not found");

  if (mobile.status !== "Instock") {
    throw new Error("Mobile already sold");
  }

  const purchase = await Purchase.findOne({
    phoneTransactionId: mobile.phoneTransactionId
  });

  if (!purchase) {
    throw new Error("Purchase data not found");
  }

  return {
    mobileId: mobile._id,
    purchaseId: mobile.purchaseId,
    model: mobile.model,
    ram: mobile.ram,
    storage: mobile.storage,
    color: mobile.color,
    imei: mobile.imei,
    image: mobile.mobilePhoto,
    purchasePrice: purchase.purchasePrice
  };
};
