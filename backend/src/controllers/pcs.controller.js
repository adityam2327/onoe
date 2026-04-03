import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getPCSService, getAllPCSService, createPCService, updatePCService, deletePCService, getAllPCsListService } from "../services/pcs.service.js";

export const getPCSByStateCode = asyncHandler(async (req, res) => {
    const { state_code } = req.params;
    const pcsList = await getPCSService(state_code);
    res.status(200).json(new ApiResponse(200, "PCS retrieved successfully", pcsList));
});

export const getAllPCS = asyncHandler(async (req, res) => {
    const pcsList = await getAllPCSService(req.query);
    res.status(200).json(new ApiResponse(200, "All PCS retrieved successfully", pcsList));
});

export const getAllPCsList = asyncHandler(async (req, res) => {
    const pcsList = await getAllPCsListService();
    res.status(200).json(new ApiResponse(200, "PCs list retrieved successfully", pcsList));
});

export const createPC = asyncHandler(async (req, res) => {
    const pc = await createPCService(req.body);
    res.status(201).json(new ApiResponse(201, "PC created successfully", pc));
});

export const updatePC = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pc = await updatePCService(id, req.body);
    res.status(200).json(new ApiResponse(200, "PC updated successfully", pc));
});

export const deletePC = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await deletePCService(id);
    res.status(200).json(new ApiResponse(200, "PC deleted successfully", {}));
});