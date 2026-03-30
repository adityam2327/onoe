import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { genrateUniqueReferenceId } from "../utils/user.util.js";

export const createUserService = async (userData) => {
    const referenceId = genrateUniqueReferenceId();
    const user = await User.create({ ...userData, referenceId });

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