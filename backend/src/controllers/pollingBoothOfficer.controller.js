import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { 
    createPollingBoothOfficerService, 
    loginPollingBoothOfficerService, 
    getPollingBoothOfficersByERO,
    getAllBooths,
    getAllMobilityBooths,
    assignBoothToOfficerService,
    assignMobilityBoothToOfficerService
} from "../services/pollingBoothOfficer.service.js";

export const createPollingBoothOfficer = asyncHandler(async (req, res) => {
    const currentOfficer = req.officer;
    const officerData = req.body;

    const newOfficer = await createPollingBoothOfficerService(currentOfficer, officerData);

    return res.status(201).json(new ApiResponse(201, "Polling booth officer created successfully", newOfficer));
});

export const loginPollingBoothOfficer = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { officer, token } = await loginPollingBoothOfficerService(email, password);

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json(new ApiResponse(200, "Login successful", officer));
});

export const getMyPollingBoothOfficers = asyncHandler(async (req, res) => {
    const currentOfficer = req.officer;
    const officers = await getPollingBoothOfficersByERO(currentOfficer);

    return res.status(200).json(new ApiResponse(200, "Polling booth officers fetched successfully", officers));
});

export const getBoothsForAssignment = asyncHandler(async (req, res) => {
    const booths = await getAllBooths();

    return res.status(200).json(new ApiResponse(200, "Booths fetched successfully", booths));
});

export const getMobilityBoothsForAssignment = asyncHandler(async (req, res) => {
    const mobilityBooths = await getAllMobilityBooths();

    return res.status(200).json(new ApiResponse(200, "Mobility booths fetched successfully", mobilityBooths));
});

export const assignBoothToOfficer = asyncHandler(async (req, res) => {
    const { officerId, boothId } = req.body;

    const officer = await assignBoothToOfficerService(officerId, boothId);

    return res.status(200).json(new ApiResponse(200, "Booth assigned successfully", officer));
});

export const assignMobilityBoothToOfficer = asyncHandler(async (req, res) => {
    const { officerId, mobilityBoothId } = req.body;

    const officer = await assignMobilityBoothToOfficerService(officerId, mobilityBoothId);

    return res.status(200).json(new ApiResponse(200, "Mobility booth assigned successfully", officer));
});
