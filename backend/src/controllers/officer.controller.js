import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { createOfficerService, loginOfficerService, getOfficersByRoleService, getMyOfficersService } from "../services/officer.service.js";

export const createOfficer = asyncHandler(async (req, res) => {
    const currentOfficer = req.officer;
    const newOfficerData = req.body;

    const newOfficer = await createOfficerService(currentOfficer, newOfficerData);

    return res.status(201).json(new ApiResponse(201, "Officer created successfully", newOfficer));
});

export const loginOfficer = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    const { officer, token } = await loginOfficerService(email, password, role);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json(new ApiResponse(200, "Login successful", officer));
});

export const getOfficersByRole = asyncHandler(async (req, res) => {
    const { role } = req.params;
    const officers = await getOfficersByRoleService(role);

    return res.status(200).json(new ApiResponse(200, "Officers fetched successfully", officers));
});

export const getMyOfficers = asyncHandler(async (req, res) => {
    const currentOfficer = req.officer;
    const officers = await getMyOfficersService(currentOfficer);

    return res.status(200).json(new ApiResponse(200, "Officers fetched successfully", officers));
});

export const getCurrentOfficer = asyncHandler(async (req, res) => {
    const officer = req.officer;
    return res.status(200).json(new ApiResponse(200, "Officer fetched successfully", officer));
});
