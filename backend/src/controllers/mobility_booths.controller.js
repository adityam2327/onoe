import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { nearestMobilityBoothsService, getAllMobilityBoothsService, createMobilityBoothService, updateMobilityBoothService, deleteMobilityBoothService } from "../services/mobility_booths.service.js";

export const nearestMobilityBooths = asyncHandler(async (req, res) => {
    const { lat, long } = req.query;

    const mobilityBooths = await nearestMobilityBoothsService(parseFloat(lat), parseFloat(long));

    if (mobilityBooths.length === 0) {
        return res.json(new ApiResponse(true, "No mobility booths found within 20 kilometers.", []));
    }

    res.json(new ApiResponse(true, "Nearest mobility booths retrieved successfully.", mobilityBooths));
});

export const getAllMobilityBooths = asyncHandler(async (req, res) => {
    const booths = await getAllMobilityBoothsService(req.query);
    res.status(200).json(new ApiResponse(200, "All mobility booths retrieved successfully", booths));
});

export const createMobilityBooth = asyncHandler(async (req, res) => {
    const booth = await createMobilityBoothService(req.body);
    res.status(201).json(new ApiResponse(201, "Mobility booth created successfully", booth));
});

export const updateMobilityBooth = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const booth = await updateMobilityBoothService(id, req.body);
    res.status(200).json(new ApiResponse(200, "Mobility booth updated successfully", booth));
});

export const deleteMobilityBooth = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await deleteMobilityBoothService(id);
    res.status(200).json(new ApiResponse(200, "Mobility booth deleted successfully", {}));
});