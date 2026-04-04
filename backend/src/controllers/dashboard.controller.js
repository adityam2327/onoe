import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getDashboardStats, getCEODashboardStats, getDEODashboardStats } from "../services/dashboard.service.js";

export const getECIStats = asyncHandler(async (req, res) => {
    const stats = await getDashboardStats();
    res.status(200).json(new ApiResponse(200, "ECI Stats retrieved successfully", stats));
});

export const getCEOStats = asyncHandler(async (req, res) => {
    const officer = req.officer;
    const state = officer.postingAddress?.state;
    
    if (!state) {
        return res.status(400).json(new ApiResponse(400, "State not found in officer profile"));
    }
    
    const stats = await getCEODashboardStats(state);
    res.status(200).json(new ApiResponse(200, "CEO Stats retrieved successfully", stats));
});

export const getDEOStats = asyncHandler(async (req, res) => {
    const officer = req.officer;
    const state = officer.postingAddress?.state;
    const district = officer.postingAddress?.district;
    
    if (!district || !state) {
        return res.status(400).json(new ApiResponse(400, "District/State not found in officer profile"));
    }
    
    const stats = await getDEODashboardStats(district, state);
    res.status(200).json(new ApiResponse(200, "DEO Stats retrieved successfully", stats));
});
