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
    const [votersCount, deosCount, erosCount, blosCount] = await Promise.all([
        mongoose.connection.db.collection("voters").countDocuments({ state }),
        mongoose.connection.db.collection("officers").countDocuments({ role: "DEO", "postingAddress.state": state }),
        mongoose.connection.db.collection("officers").countDocuments({ role: "ERO", "postingAddress.state": state }),
        mongoose.connection.db.collection("officers").countDocuments({ role: "BLO", "postingAddress.state": state })
    ]);

    return {
        voters: votersCount,
        deos: deosCount,
        eros: erosCount,
        blos: blosCount
    };
};

export const getDEODashboardStats = async (district, state) => {
    const [erosCount, blosCount, boothsCount, assemblies] = await Promise.all([
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
        mongoose.connection.db.collection("booths").countDocuments({ state, district }),
        mongoose.connection.db.collection("voters").distinct("assembley", { state, district })
    ]);

    return {
        eros: erosCount,
        blos: blosCount,
        booths: boothsCount,
        assemblies: assemblies.length
    };
};

export const getERODashboardStats = async (assembly, district, state) => {
    const [blosCount, boothsCount] = await Promise.all([
        mongoose.connection.db.collection("officers").countDocuments({ 
            role: "BLO", 
            "postingAddress.state": state,
            "postingAddress.district": district,
            "postingAddress.assembley": assembly 
        }),
        mongoose.connection.db.collection("booths").countDocuments({ state, district, assembley: assembly })
    ]);

    return {
        blos: blosCount,
        booths: boothsCount
    };
};

export const getBLODashboardStats = async (boothNumber, assembly, district, state) => {
    const [votersCount, pendingVerifications] = await Promise.all([
        mongoose.connection.db.collection("voters").countDocuments({ state, district, assembley: assembly, boothNumber }),
        mongoose.connection.db.collection("users").countDocuments({ 
            state, 
            district, 
            assembley: assembly, 
            boothNumber,
            "verification.level": "BLO",
            "verification.status": "pending"
        })
    ]);

    return {
        voters: votersCount,
        pending: pendingVerifications
    };
};
