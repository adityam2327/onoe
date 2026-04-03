import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

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
