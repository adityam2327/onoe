import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getDashboardStats } from "../services/dashboard.service.js";

export const getECIStats = asyncHandler(async (req, res) => {
    const stats = await getDashboardStats();
    res.status(200).json(new ApiResponse(200, "ECI Stats retrieved successfully", stats));
});
