import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getPCSService } from "../services/pcs.service.js";

export const getPCSByStateCode = asyncHandler(async (req, res) => {
    const { state_code } = req.params;
    const pcsList = await getPCSService(state_code);
    res.status(200).json(new ApiResponse(200, "PCS retrieved successfully", pcsList));
})