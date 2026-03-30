import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getPCSService } from "../services/pcs.service.js";

export const getPCSByStateCode = asyncHandler(async (req, res) => {
    const { state_code } = req.params;
    console.log("Received state_code:", state_code); // Debug log
    const normalizedCode = String(Number(state_code));
    const pcsList = await getPCSService(normalizedCode);
    res.status(200).json(new ApiResponse(200, "PCS retrieved successfully", pcsList));
})