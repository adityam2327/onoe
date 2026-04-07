import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { loginVoterService, getAllVotersService, checkVoterAndUserViaAadharService, getVotersByBoothIdService, assignMobilityBoothService, verifyMobilityBoothService, getMobilityBoothRequestsService, getVotersByStateService, markVoterAsDeletedService, getDeletedVotersService, searchVotersService } from "../services/voter.service.js";

export const loginVoter = asyncHandler(async (req, res) => {
    const { uniqueVoterId, password } = req.body;

    const { voter, token } = await loginVoterService(uniqueVoterId, password);

    return res.status(200).json(new ApiResponse(200, "Login successful", { voter, token }));
});

export const getAllVoters = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filter = {};
    if (req.query.state) filter.state = req.query.state;
    if (req.query.district) filter.district = req.query.district;
    if (req.query.assembly) filter.assembley = req.query.assembly;
    if (req.query.gender) filter.gender = req.query.gender;

    const { voters, pagination } = await getAllVotersService(page, limit, filter);

    return res.status(200).json(new ApiResponse(200, "Voters fetched successfully", { voters, pagination }));
});

export const checkVoterAndUserViaAadhar = asyncHandler(async (req, res) => {
    const { aadharNumber } = req.body;

    const { voter, user } = await checkVoterAndUserViaAadharService(aadharNumber);

    if (voter) {
        return res.status(200).json(new ApiResponse(200, "Voter exists with this Aadhar number", { exists: true }));
    } else if (user) {
        return res.status(200).json(new ApiResponse(200, "User exists with this Aadhar number", { exists: true }));
    }

    return res.status(200).json(new ApiResponse(200, "No voter or user exists with this Aadhar number", { exists: false }));
})

export const getVotersByBoothId = asyncHandler(async (req, res) => {
    const { boothId } = req.body;

    const voters = await getVotersByBoothIdService(String(boothId));

    return res.status(200).json(new ApiResponse(200, "Voters fetched successfully", voters));
});

export const assignMobilityBooth = asyncHandler(async (req, res) => {
    const { voterId, boothId } = req.body;

    const voter = await assignMobilityBoothService(voterId, boothId);

    return res.status(200).json(new ApiResponse(200, "Mobility booth assigned successfully", voter));
});

export const verifyMobilityBooth = asyncHandler(async (req, res) => {
    const { voterId, isVerified } = req.body;

    const voter = await verifyMobilityBoothService(voterId, isVerified);

    return res.status(200).json(new ApiResponse(200, `Mobility booth ${isVerified ? 'verified' : 'rejected'} successfully`, voter));
});

export const getMobilityBoothRequests = asyncHandler(async (req, res) => {
    const voters = await getMobilityBoothRequestsService();

    return res.status(200).json(new ApiResponse(200, "Mobility booth requests fetched successfully", voters));
});

export const getVotersByState = asyncHandler(async (req, res) => {
    const { state } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!state) {
        return res.status(400).json(new ApiResponse(400, "State is required"));
    }

    const result = await getVotersByStateService(state, page, limit);

    return res.status(200).json(new ApiResponse(200, "Voters fetched successfully", result));
});

export const markVoterAsDeleted = asyncHandler(async (req, res) => {
    const { voterId, reason } = req.body;
    const officer = req.officer;
    const officerName = officer ? `${officer.name} (${officer.role})` : "Unknown";

    const voter = await markVoterAsDeletedService(voterId, reason, officerName);

    return res.status(200).json(new ApiResponse(200, "Voter marked as deleted successfully", voter));
});

export const getDeletedVoters = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getDeletedVotersService(page, limit);

    return res.status(200).json(new ApiResponse(200, "Deleted voters fetched successfully", result));
});

export const searchVoters = asyncHandler(async (req, res) => {
    const { phoneNumber, aadharNumber, uniqueVoterId, name } = req.query;
    
    if (!phoneNumber && !aadharNumber && !uniqueVoterId && !name) {
        return res.status(400).json(new ApiResponse(400, "At least one search parameter is required"));
    }

    const voters = await searchVotersService({ phoneNumber, aadharNumber, uniqueVoterId, name });

    return res.status(200).json(new ApiResponse(200, "Voters fetched successfully", voters));
});