import api from "@/lib/axios";

export const getAllVoters = async (params = {}) => {
    try {
        const response = await api.get("/voters/all", { params });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch voters");
    }
};

export const getMobilityRequests = async () => {
    try {
        const response = await api.get("/voters/mobility/requests");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch mobility requests");
    }
};

export const assignMobilityBooth = async (voterId, boothId) => {
    try {
        const response = await api.post("/voters/mobility/assign", { voterId, boothId });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to assign mobility booth");
    }
};

export const verifyMobilityBooth = async (voterId, isVerified) => {
    try {
        const response = await api.post("/voters/mobility/verify", { voterId, isVerified });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to verify mobility booth");
    }
};
