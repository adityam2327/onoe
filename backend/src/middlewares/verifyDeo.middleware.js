import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyDeo = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "DEO") {
        throw new ApiError(403, "Access denied: Only DEO can perform this action");
    }
    next();
});