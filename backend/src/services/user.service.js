import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { genrateUniqueReferenceId } from "../utils/user.util.js";

export const createUserService = async (userData) => {
    const referenceId = genrateUniqueReferenceId();
    const verification = [
        { level: "BLO", status: "pending", remarks: "", verifiedAt: null },
        { level: "ERO", status: "pending", remarks: "", verifiedAt: null },
        { level: "DEO", status: "pending", remarks: "", verifiedAt: null },
        { level: "AI", status: "verified", remarks: "Auto-verified by AI system - Document verification successful", verifiedAt: new Date() }
    ];
    const user = await User.create({ ...userData, referenceId, verification });

    if (!user) {
        throw new ApiError(500, "Failed to create user");
    }

    return user;
};

export const getUsersService = async () => {
    const users = await User.find();

    if (!users) {
        throw new ApiError(404, "No users found");
    }

    return users;
}

export const getUserByIdService = async (id) => {
    const user = await User.findById(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};