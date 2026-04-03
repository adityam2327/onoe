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

export const getAllACSService = async (params = {}) => {
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (params.state_code) query.state_code = params.state_code;
    if (params.pc_code) query.pc_code = params.pc_code;
    
    const [acs, total] = await Promise.all([
        mongoose.connection.db.collection("acs")
            .find(query)
            .skip(skip)
            .limit(limit)
            .toArray(),
        mongoose.connection.db.collection("acs").countDocuments(query)
    ]);

    return {
        acs,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

export const createACService = async (data) => {
    const { state_code, pc_code, assembly_code, assembly_name } = data;
    
    const existing = await mongoose.connection.db.collection("acs").findOne({ assembly_code });
    if (existing) {
        throw new ApiError(400, "AC with this code already exists");
    }

    const result = await mongoose.connection.db.collection("acs").insertOne({
        state_code,
        pc_code,
        assembly_code,
        assembly_name,
        created_at: new Date(),
        updated_at: new Date()
    });

    return { _id: result.insertedId, state_code, pc_code, assembly_code, assembly_name };
}

export const updateACService = async (id, data) => {
    const { assembly_name } = data;

    const result = await mongoose.connection.db.collection("acs").findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: { assembly_name, updated_at: new Date() } },
        { returnDocument: "after" }
    );

    if (!result) {
        throw new ApiError(404, "AC not found");
    }

    return result;
}

export const deleteACService = async (id) => {
    const result = await mongoose.connection.db.collection("acs").deleteOne({ _id: new mongoose.Types.ObjectId(id) });

    if (result.deletedCount === 0) {
        throw new ApiError(404, "AC not found");
    }

    return { message: "AC deleted successfully" };
}

export const getAllACsListService = async () => {
    const acs = await mongoose.connection.db.collection("acs").find({}).toArray();
    return acs;
}

export const getACsCount = async () => {
    return await mongoose.connection.db.collection("acs").countDocuments();
}