import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export const getStateService = async () => {
    const states = await mongoose.connection.db.collection("states").find({}).toArray();

    if (!states) {
        throw new ApiError(404, "States not found");
    }
    
    return states;
}

export const getAllStatesService = async (params = {}) => {
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (params.search) {
        query.$or = [
            { state_name: { $regex: params.search, $options: "i" } },
            { state_code: { $regex: params.search, $options: "i" } }
        ];
    }

    const [states, total] = await Promise.all([
        mongoose.connection.db.collection("states")
            .find(query)
            .skip(skip)
            .limit(limit)
            .toArray(),
        mongoose.connection.db.collection("states").countDocuments(query)
    ]);

    return {
        states,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

export const createStateService = async (data) => {
    const { state_code, state_name, state_type } = data;

    const existing = await mongoose.connection.db.collection("states").findOne({ state_code });
    if (existing) {
        throw new ApiError(400, "State with this code already exists");
    }

    const result = await mongoose.connection.db.collection("states").insertOne({
        state_code,
        state_name,
        state_type,
        created_at: new Date(),
        updated_at: new Date()
    });

    return { _id: result.insertedId, state_code, state_name, state_type };
}

export const updateStateService = async (id, data) => {
    const updateData = { ...data, updated_at: new Date() };
    delete updateData._id;

    const result = await mongoose.connection.db.collection("states").findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: updateData },
        { returnDocument: "after" }
    );

    if (!result) {
        throw new ApiError(404, "State not found");
    }

    return result;
}

export const deleteStateService = async (id) => {
    const result = await mongoose.connection.db.collection("states").deleteOne({ _id: new mongoose.Types.ObjectId(id) });

    if (result.deletedCount === 0) {
        throw new ApiError(404, "State not found");
    }

    return { message: "State deleted successfully" };
}

export const getStatesCount = async () => {
    return await mongoose.connection.db.collection("states").countDocuments();
}