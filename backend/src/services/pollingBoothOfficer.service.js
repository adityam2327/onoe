import { PollingBoothOfficer } from "../models/polling_booth_officer.model.js";
import { Booths } from "../models/booths.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export const createPollingBoothOfficerService = async (eroOfficer, officerData) => {
    const { assignmentType, boothId, mobilityBoothId, ...otherData } = officerData;

    let booth = null;
    let mobilityBooth = null;

    if (assignmentType === "booth" && boothId) {
        booth = await Booths.findById(boothId);
        if (!booth) {
            throw new ApiError(404, "Booth not found");
        }
    } else if (assignmentType === "mobility_booth" && mobilityBoothId) {
        mobilityBooth = await mongoose.connection.db.collection("mobility_booths").findOne({ _id: new mongoose.Types.ObjectId(mobilityBoothId) });
        if (!mobilityBooth) {
            throw new ApiError(404, "Mobility booth not found");
        }
    }

    const officerDataToCreate = {
        ...otherData,
        assignmentType,
        booth: booth?._id,
        mobilityBooth: mobilityBooth?._id,
        isAssigned: !!booth || !!mobilityBooth,
        ero: eroOfficer._id
    };

    const officer = await PollingBoothOfficer.create(officerDataToCreate);

    return officer;
};

export const loginPollingBoothOfficerService = async (email, password) => {
    const officer = await PollingBoothOfficer.findOne({ email }).populate("booth");

    if (!officer) {
        throw new ApiError(401, "Invalid credentials");
    }

    if (!officer.comparePassword(password)) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = officer.generateAuthToken();

    return { officer, token };
};

export const getPollingBoothOfficersByERO = async (eroOfficer) => {
    const officers = await PollingBoothOfficer.find({ ero: eroOfficer._id })
        .select("-password")
        .populate("booth");
    
    for (const officer of officers) {
        if (officer.mobilityBooth) {
            const mobilityBooth = await mongoose.connection.db.collection("mobility_booths").findOne({ _id: new mongoose.Types.ObjectId(officer.mobilityBooth) });
            officer._doc.mobilityBooth = mobilityBooth;
        }
    }
    
    return officers;
};

export const getAllBooths = async () => {
    const booths = await Booths.find();
    return booths;
};

export const getAllMobilityBooths = async () => {
    const mobilityBooths = await mongoose.connection.db.collection("mobility_booths").find({}).toArray();
    return mobilityBooths;
};

export const assignBoothToOfficerService = async (officerId, boothId) => {
    const officer = await PollingBoothOfficer.findById(officerId);
    if (!officer) {
        throw new ApiError(404, "Officer not found");
    }

    const booth = await Booths.findById(boothId);
    if (!booth) {
        throw new ApiError(404, "Booth not found");
    }

    officer.booth = boothId;
    officer.mobilityBooth = null;
    officer.assignmentType = "booth";
    officer.isAssigned = true;
    await officer.save();

    return officer;
};

export const assignMobilityBoothToOfficerService = async (officerId, mobilityBoothId) => {
    const officer = await PollingBoothOfficer.findById(officerId);
    if (!officer) {
        throw new ApiError(404, "Officer not found");
    }

    const mobilityBooth = await mongoose.connection.db.collection("mobility_booths").findOne({ _id: new mongoose.Types.ObjectId(mobilityBoothId) });
    if (!mobilityBooth) {
        throw new ApiError(404, "Mobility booth not found");
    }

    officer.mobilityBooth = mobilityBoothId;
    officer.booth = null;
    officer.assignmentType = "mobility_booth";
    officer.isAssigned = true;
    await officer.save();

    return officer;
};
