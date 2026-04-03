import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export const getPCSService = async (state_code) => {
    if (!state_code) {
        throw new ApiError(400, "State code is required");
    }

    const pcsList = await mongoose.connection.db.collection("pcs").find({ state_code }).toArray();

    if (!pcsList || pcsList.length === 0) {
        throw new ApiError(404, "PCS not found for the given state code");
    }

    return pcsList;
}

export const getAllPCSService = async (params = {}) => {
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const skip = (page - 1) * limit;

    const query = params.state_code ? { state_code: params.state_code } : {};
    
    const [pcs, total] = await Promise.all([
        mongoose.connection.db.collection("pcs")
            .find(query)
            .skip(skip)
            .limit(limit)
            .toArray(),
        mongoose.connection.db.collection("pcs").countDocuments(query)
    ]);

    return {
        pcs,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

export const createPCService = async (data) => {
    const { state_code, pc_code, pc_name } = data;
    
    const existing = await mongoose.connection.db.collection("pcs").findOne({ pc_code });
    if (existing) {
        throw new ApiError(400, "PC with this code already exists");
    }

    const result = await mongoose.connection.db.collection("pcs").insertOne({
        state_code,
        pc_code,
        pc_name,
        created_at: new Date(),
        updated_at: new Date()
    });

    return { _id: result.insertedId, state_code, pc_code, pc_name };
}

export const updatePCService = async (id, data) => {
    const { pc_name } = data;

    const result = await mongoose.connection.db.collection("pcs").findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: { pc_name, updated_at: new Date() } },
        { returnDocument: "after" }
    );

    if (!result) {
        throw new ApiError(404, "PC not found");
    }

    return result;
}

export const deletePCService = async (id) => {
    const result = await mongoose.connection.db.collection("pcs").deleteOne({ _id: new mongoose.Types.ObjectId(id) });

    if (result.deletedCount === 0) {
        throw new ApiError(404, "PC not found");
    }

    return { message: "PC deleted successfully" };
}

export const getAllPCsListService = async () => {
    const pcsList = await mongoose.connection.db.collection("pcs").find({}).toArray();
    return pcsList;
}

export const getPCsCount = async () => {
    return await mongoose.connection.db.collection("pcs").countDocuments();
}