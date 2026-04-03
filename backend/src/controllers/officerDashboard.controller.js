import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    getPendingUsersForBLO,
    getPendingUsersForERO,
    getPendingUsersForDEO,
    verifyUserByBLO,
    rejectUserByBLO,
    verifyUserByERO,
    rejectUserByERO,
    verifyUserByDEO,
    rejectUserByDEO,
    convertVerifiedUserToVoter,
    convertAllVerifiedUsersToVoters
} from "../services/officerDashboard.service.js";

export const getPendingUsers = asyncHandler(async (req, res) => {
    const officer = req.officer;
    let users;

    switch (officer.role) {
        case "BLO":
            users = await getPendingUsersForBLO(officer);
            break;
        case "ERO":
            users = await getPendingUsersForERO(officer);
            break;
        case "DEO":
            users = await getPendingUsersForDEO(officer);
            break;
        default:
            throw new Error("You don't have permission to view pending users");
    }

    const sanitizedUsers = users.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
    });

    return res.status(200).json(new ApiResponse(200, "Pending users fetched successfully", sanitizedUsers));
});

export const verifyUser = asyncHandler(async (req, res) => {
    const { userId, remarks } = req.body;
    const officer = req.officer;

    let result;
    let responseMessage = `User verified by ${officer.role} successfully`;

    switch (officer.role) {
        case "BLO":
            result = await verifyUserByBLO(userId, remarks);
            break;
        case "ERO":
            result = await verifyUserByERO(userId, remarks);
            break;
        case "DEO":
            const deoResult = await verifyUserByDEO(userId, remarks);
            result = deoResult.user;
            responseMessage = "User verified and converted to Voter successfully!";
            break;
        default:
            throw new Error("You don't have permission to verify users");
    }

    const userData = result.toObject ? result.toObject() : result;
    const { password, ...safeUser } = userData;

    return res.status(200).json(new ApiResponse(200, `User rejected by ${officer.role} successfully`, safeUser));
});

export const convertToVoter = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    
    const voter = await convertVerifiedUserToVoter(userId);
    
    return res.status(201).json(new ApiResponse(201, "User converted to voter successfully", voter));
});

export const convertAllVerifiedToVoters = asyncHandler(async (req, res) => {
    const result = await convertAllVerifiedUsersToVoters();
    
    return res.status(200).json(new ApiResponse(200, "Batch conversion completed", result));
});

export const rejectUser = asyncHandler(async (req, res) => {
    const { userId, remarks } = req.body;
    const officer = req.officer;

    if (!remarks) {
        return res.status(400).json(new ApiResponse(400, "Remarks are required when rejecting a user"));
    }

    let result;

    switch (officer.role) {
        case "BLO":
            result = await rejectUserByBLO(userId, remarks);
            break;
        case "ERO":
            result = await rejectUserByERO(userId, remarks);
            break;
        case "DEO":
            result = await rejectUserByDEO(userId, remarks);
            break;
        default:
            throw new Error("You don't have permission to reject users");
    }

    const { password, ...safeUser } = result.toObject ? result.toObject() : result;

    return res.status(200).json(new ApiResponse(200, `User rejected by ${officer.role} successfully`, safeUser));
});
