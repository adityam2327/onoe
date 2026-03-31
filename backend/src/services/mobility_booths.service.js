import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export const nearestMobilityBoothsService = async (latitude, longitude) => {
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        throw new ApiError(400, "Valid latitude and longitude are required.");
    }

    const mobilityBooths = await mongoose.connection.db.collection("mobility_booths").find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                $maxDistance: 5000 // 5 kilometers
            }
        }
    }).toArray();

    if (!mobilityBooths || mobilityBooths.length === 0) {
        throw new ApiError(404, "No mobility booths found near the given location.");
    }

    return mobilityBooths;
}