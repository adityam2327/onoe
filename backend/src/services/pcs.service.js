import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export const getPCSService = async (state_code) => {
    if (!state_code) {
        throw new ApiError(400, "State code is required");
    }

    const count = await mongoose.connection.db
        .collection("pcs")
        .countDocuments();

    console.log("PCS COUNT:", count);

    const pcsList = await mongoose.connection.db.collection("pcs").find({ state_code }).toArray();

    if (!pcsList || pcsList.length === 0) {
        throw new ApiError(404, "PCS not found for the given state code");
    }

    return pcsList;
}