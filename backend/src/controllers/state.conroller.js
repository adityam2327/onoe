import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { getStateService, getAllStatesService, createStateService, updateStateService, deleteStateService, getStatesCount } from '../services/state.service.js';

export const getStates = asyncHandler(async (req, res) => {
    const states = await getStateService();
    res.status(200).json(new ApiResponse(200, "States retrieved successfully", states));
});

export const getAllStates = asyncHandler(async (req, res) => {
    const states = await getAllStatesService(req.query);
    res.status(200).json(new ApiResponse(200, "All states retrieved successfully", states));
});

export const getStatesStats = asyncHandler(async (req, res) => {
    const count = await getStatesCount();
    res.status(200).json(new ApiResponse(200, "States count retrieved successfully", { count }));
});

export const createState = asyncHandler(async (req, res) => {
    const state = await createStateService(req.body);
    res.status(201).json(new ApiResponse(201, "State created successfully", state));
});

export const updateState = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const state = await updateStateService(id, req.body);
    res.status(200).json(new ApiResponse(200, "State updated successfully", state));
});

export const deleteState = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await deleteStateService(id);
    res.status(200).json(new ApiResponse(200, "State deleted successfully", {}));
});