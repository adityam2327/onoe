import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { loginVoterService } from "../services/voter.service.js";

export const loginVoter = asyncHandler(async (req, res) => {
    const { uniqueVoterId, password } = req.body;

    const { voter, token } = await loginVoterService(uniqueVoterId, password);

    return res.status(200).json(new ApiResponse(200, "Login successful", { voter, token }));
});