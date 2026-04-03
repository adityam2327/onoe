import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getACSByPCCodeService, getAllACSService, createACService, updateACService, deleteACService, getAllACsListService } from "../services/acs.service.js";

export const getACSByPCCode = asyncHandler(async (req, res) => {
    const { pc_code } = req.params;

    const acs = await getACSByPCCodeService(pc_code);

    res.status(200).json(new ApiResponse(200, "ACS retrieved successfully", acs));
});

export const getAllACS = asyncHandler(async (req, res) => {
    const acs = await getAllACSService(req.query);
    res.status(200).json(new ApiResponse(200, "All ACS retrieved successfully", acs));
});

export const getAllACsList = asyncHandler(async (req, res) => {
    const acs = await getAllACsListService();
    res.status(200).json(new ApiResponse(200, "ACs list retrieved successfully", acs));
});

export const createAC = asyncHandler(async (req, res) => {
    const ac = await createACService(req.body);
    res.status(201).json(new ApiResponse(201, "AC created successfully", ac));
});

export const updateAC = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const ac = await updateACService(id, req.body);
    res.status(200).json(new ApiResponse(200, "AC updated successfully", ac));
});

export const deleteAC = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await deleteACService(id);
    res.status(200).json(new ApiResponse(200, "AC deleted successfully", {}));
});
