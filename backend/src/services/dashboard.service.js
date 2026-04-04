import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { Officer } from "../models/officer.model.js";

export const getDashboardStats = async () => {
    const [votersCount, ceosCount, deosCount, blosCount, acsCount, pcsCount, statesCount, boothsCount, mobilityBoothsCount] = await Promise.all([
        mongoose.connection.db.collection("voters").countDocuments(),
        mongoose.connection.db.collection("officers").countDocuments({ role: "CEO" }),
        mongoose.connection.db.collection("officers").countDocuments({ role: "DEO" }),
        mongoose.connection.db.collection("officers").countDocuments({ role: "BLO" }),
        mongoose.connection.db.collection("acs").countDocuments(),
        mongoose.connection.db.collection("pcs").countDocuments(),
        mongoose.connection.db.collection("states").countDocuments(),
        mongoose.connection.db.collection("booths").countDocuments(),
        mongoose.connection.db.collection("mobility_booths").countDocuments()
    ]);

    return {
        voters: votersCount,
        ceos: ceosCount,
        deos: deosCount,
        blos: blosCount,
        acs: acsCount,
        pcs: pcsCount,
        states: statesCount,
        booths: boothsCount,
        mobilityBooths: mobilityBoothsCount
    };
};

export const getCEODashboardStats = async (state) => {
    const [votersCount, deosCount, erosCount, blosCount, boothsCount] = await Promise.all([
        mongoose.connection.db.collection("voters").countDocuments({ state }),
        mongoose.connection.db.collection("officers").countDocuments({ role: "DEO", "postingAddress.state": state }),
        mongoose.connection.db.collection("officers").countDocuments({ role: "ERO", "postingAddress.state": state }),
        mongoose.connection.db.collection("officers").countDocuments({ role: "BLO", "postingAddress.state": state }),
        mongoose.connection.db.collection("booths").countDocuments({ state })
    ]);

    return {
        voters: votersCount,
        deos: deosCount,
        eros: erosCount,
        blos: blosCount,
        booths: boothsCount
    };
};

export const getDEODashboardStats = async (district, state) => {
    const [erosCount, blosCount, votersCount, boothsCount, assemblies] = await Promise.all([
        mongoose.connection.db.collection("officers").countDocuments({ 
            role: "ERO", 
            "postingAddress.state": state,
            "postingAddress.district": district 
        }),
        mongoose.connection.db.collection("officers").countDocuments({ 
            role: "BLO", 
            "postingAddress.state": state,
            "postingAddress.district": district 
        }),
        mongoose.connection.db.collection("voters").countDocuments({ state, district }),
        mongoose.connection.db.collection("booths").countDocuments({ state, district }),
        mongoose.connection.db.collection("voters").distinct("assembley", { state, district })
    ]);

    return {
        voters: votersCount,
        eros: erosCount,
        blos: blosCount,
        booths: boothsCount,
        assemblies: assemblies.length
    };
};
