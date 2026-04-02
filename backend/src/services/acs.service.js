import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export const getACSByPCCodeService = async (pc_code) => {
    if (!pc_code) {
        throw new ApiError(400, "PC code is required");
    }

    const acs = await mongoose.connection.db.collection("acs").find({ pc_code }).toArray();

    if (!acs || acs.length === 0) {
        throw new ApiError(404, "ACS not found for the given PC code");
    }

    return acs;
}

export const getAllACSService = async () => {
    const acs = await mongoose.connection.db.collection("acs").find({}).toArray();
    return acs;
}