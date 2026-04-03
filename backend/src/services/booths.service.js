import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { ApiError } from "../utils/ApiError.js";

export const getBoothsByACCodeService = async (ac_code) => {
    if (!ac_code || typeof ac_code !== "string") {
        throw new ApiError(400, "AC code is required and must be a string");
    }

    console.log("Fetching booths for AC code:", ac_code);

    const booths = await mongoose.connection.db.collection("booths").find({ ac_code }).toArray();

    console.log(`Booths found for AC code ${ac_code}:`, booths);

    if (!booths || booths.length === 0) {
        throw new ApiError(404, "Booths not found for the given AC code");
    }

    return booths;
}

export const getAllBoothsService = async (page = 1, limit = 10, filter = {}) => {
    const skip = (page - 1) * limit;
    const boothsCollection = mongoose.connection.db.collection("booths");
    const acsCollection = mongoose.connection.db.collection("acs");

    const pipeline = [];

    if (filter.state_code || filter.ac_code || filter.pc_code) {
        const acMatch = {};
        if (filter.state_code) acMatch.state_code = filter.state_code;
        if (filter.pc_code) acMatch.pc_code = filter.pc_code;

        const acCodes = await acsCollection.find(acMatch).toArray();
        const acCodeList = acCodes.map(ac => ac.assembly_code);

        if (filter.ac_code) {
            const filteredCodes = acCodeList.filter(code => code === filter.ac_code);
            if (filteredCodes.length === 0) {
                return { booths: [], pagination: { page, limit, total: 0, totalPages: 0 } };
            }
            pipeline.push({ $match: { ac_code: { $in: filteredCodes } } });
        } else {
            if (acCodeList.length === 0) {
                return { booths: [], pagination: { page, limit, total: 0, totalPages: 0 } };
            }
            pipeline.push({ $match: { ac_code: { $in: acCodeList } } });
        }
    }

    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await boothsCollection.aggregate(countPipeline).toArray();
    const total = countResult.length > 0 ? countResult[0].total : 0;

    pipeline.push({ $sort: { ac_code: 1, booth_no: 1 } });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const booths = await boothsCollection.aggregate(pipeline).toArray();

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

export const createBoothService = async (boothData) => {
    const { ac_code, booth_no, booth_name } = boothData;

    if (!ac_code || !booth_no || !booth_name) {
        throw new ApiError(400, "ac_code, booth_no, and booth_name are required");
    }

    const boothsCollection = mongoose.connection.db.collection("booths");

    const existingBooth = await boothsCollection.findOne({ ac_code, booth_no });
    if (existingBooth) {
        throw new ApiError(409, "Booth with this number already exists in this assembly constituency");
    }

    const result = await boothsCollection.insertOne({
        ac_code: String(ac_code),
        booth_no: String(booth_no),
        booth_name: String(booth_name)
    });

    const booth = await boothsCollection.findOne({ _id: result.insertedId });

    return booth;
}

export const updateBoothService = async (id, boothData) => {
    if (!id) {
        throw new ApiError(400, "Booth ID is required");
    }

    const { booth_no, booth_name } = boothData;

    if (!booth_no && !booth_name) {
        throw new ApiError(400, "At least one field (booth_no or booth_name) is required");
    }

    const boothsCollection = mongoose.connection.db.collection("booths");

    const existing = await boothsCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) {
        throw new ApiError(404, "Booth not found");
    }

    const updateFields = {};
    if (booth_no) updateFields.booth_no = String(booth_no);
    if (booth_name) updateFields.booth_name = String(booth_name);

    if (booth_no && booth_no !== existing.booth_no) {
        const duplicate = await boothsCollection.findOne({
            ac_code: existing.ac_code,
            booth_no: String(booth_no),
            _id: { $ne: new ObjectId(id) }
        });
        if (duplicate) {
            throw new ApiError(409, "Booth with this number already exists in this assembly constituency");
        }
    }

    await boothsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
    );

    return await boothsCollection.findOne({ _id: new ObjectId(id) });
}

export const deleteBoothService = async (id) => {
    if (!id) {
        throw new ApiError(400, "Booth ID is required");
    }

    const boothsCollection = mongoose.connection.db.collection("booths");

    const existing = await boothsCollection.findOne({ _id: new ObjectId(id) });
    if (!existing) {
        throw new ApiError(404, "Booth not found");
    }

    await boothsCollection.deleteOne({ _id: new ObjectId(id) });

    return existing;
}

export const getBoothsCount = async () => {
    return await mongoose.connection.db.collection("booths").countDocuments();
}