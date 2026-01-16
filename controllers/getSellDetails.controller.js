import { getSellDetails } from "../services/getSellDetails.service.js";

export const getSellDetailsController = async (req, res) => {
  const data = await getSellDetails(req.params.id);
  res.json({ success: true, message: "Mobile with purchase data fetched successfully", data });
};
