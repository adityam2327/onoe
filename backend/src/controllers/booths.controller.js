import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getBoothsByACCodeService, getAllBoothsService, createBoothService, updateBoothService, deleteBoothService } from "../services/booths.service.js";

export const getBoothsByACSCode = asyncHandler(async (req, res) => {
    const ac_code = String(req.params.acs_code).toUpperCase();

    const booths = await getBoothsByACCodeService(ac_code);

    res.status(200).json(new ApiResponse(200, "Booths retrieved successfully", booths));
});

export const getAllBooths = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filter = {};
    if (req.query.state_code) filter.state_code = req.query.state_code;
    if (req.query.pc_code) filter.pc_code = req.query.pc_code;
    if (req.query.ac_code) filter.ac_code = req.query.ac_code;

    const { booths, pagination } = await getAllBoothsService(page, limit, filter);

    return res.status(200).json(new ApiResponse(200, "Booths fetched successfully", { booths, pagination }));
});

export const createBooth = asyncHandler(async (req, res) => {
    const booth = await createBoothService(req.body);

    return res.status(201).json(new ApiResponse(201, "Booth created successfully", booth));
});

export const updateBooth = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const booth = await updateBoothService(id, req.body);

    return res.status(200).json(new ApiResponse(200, "Booth updated successfully", booth));
});

export const deleteBooth = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const booth = await deleteBoothService(id);

    return res.status(200).json(new ApiResponse(200, "Booth deleted successfully", booth));
});