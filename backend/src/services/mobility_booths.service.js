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
                $maxDistance: 50000
            }
        }
    }).toArray();

    return mobilityBooths;
}

export const getAllMobilityBoothsService = async (params = {}) => {
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (params.search) {
        query.$or = [
            { boothName: { $regex: params.search, $options: "i" } },
            { boothId: { $regex: params.search, $options: "i" } },
            { areaName: { $regex: params.search, $options: "i" } }
        ];
    }
    if (params.isActive !== undefined && params.isActive !== "") {
        query.isActive = params.isActive === "true";
    }

    const [booths, total] = await Promise.all([
        mongoose.connection.db.collection("mobility_booths")
            .find(query)
            .skip(skip)
            .limit(limit)
            .toArray(),
        mongoose.connection.db.collection("mobility_booths").countDocuments(query)
    ]);

    return {
        booths,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

export const createMobilityBoothService = async (data) => {
    const { boothId, boothName, areaName, address, contactPerson, contactPhone, coordinates, totalCapacity } = data;

    const existing = await mongoose.connection.db.collection("mobility_booths").findOne({ boothId });
    if (existing) {
        throw new ApiError(400, "Mobility booth with this ID already exists");
    }

    const result = await mongoose.connection.db.collection("mobility_booths").insertOne({
        boothId,
        boothName,
        areaName,
        address,
        contactPerson,
        contactPhone,
        location: {
            type: "Point",
            coordinates: [coordinates[0], coordinates[1]]
        },
        totalCapacity,
        currentQueue: 0,
        isActive: true,
        created_at: new Date(),
        updated_at: new Date()
    });

    return { _id: result.insertedId, boothId, boothName, areaName, address, contactPerson, contactPhone, totalCapacity };
}

export const updateMobilityBoothService = async (id, data) => {
    const updateData = { ...data, updated_at: new Date() };
    delete updateData._id;

    if (data.coordinates) {
        updateData.location = {
            type: "Point",
            coordinates: [data.coordinates[0], data.coordinates[1]]
        };
        delete updateData.coordinates;
    }

    const result = await mongoose.connection.db.collection("mobility_booths").findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: updateData },
        { returnDocument: "after" }
    );

    if (!result) {
        throw new ApiError(404, "Mobility booth not found");
    }

    return result;
}

export const deleteMobilityBoothService = async (id) => {
    const result = await mongoose.connection.db.collection("mobility_booths").deleteOne({ _id: new mongoose.Types.ObjectId(id) });

    if (result.deletedCount === 0) {
        throw new ApiError(404, "Mobility booth not found");
    }

    return { message: "Mobility booth deleted successfully" };
}

export const getMobilityBoothsCount = async () => {
    return await mongoose.connection.db.collection("mobility_booths").countDocuments();
}