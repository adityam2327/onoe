import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getACSByPCCodeService, getAllACSService } from "../services/acs.service.js";

export const getACSByPCCode = asyncHandler(async (req, res) => {
    const { pc_code } = req.params;

    const acs = await getACSByPCCodeService(pc_code);

    res.status(200).json(new ApiResponse(200, "ACS retrieved successfully", acs));
});

export const getAllACS = asyncHandler(async (req, res) => {
    const acs = await getAllACSService();
    res.status(200).json(new ApiResponse(200, "All ACS retrieved successfully", acs));
});
