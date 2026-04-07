import api from "@/lib/axios";

export const getAllVoters = async (params = {}) => {
    try {
        const response = await api.get("/voters/all", { params });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch voters");
    }
};

export const getVotersByState = async (state, page = 1, limit = 10) => {
    try {
        const response = await api.get("/voters/by-state", { params: { state, page, limit } });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch voters by state");
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

export const markVoterAsDeleted = async (voterId, reason) => {
    try {
        const response = await api.post("/voters/mark-deleted", { voterId, reason });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to mark voter as deleted");
    }
};

export const getDeletedVoters = async (page = 1, limit = 10) => {
    try {
        const response = await api.get("/voters/deleted", { params: { page, limit } });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch deleted voters");
    }
};

export const getVotersByBoothId = async (boothId) => {
    try {
        const response = await api.get("/voters/by-booth", { params: { boothId } });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch voters by booth");
    }
};

export const searchVoters = async (searchParams) => {
    const params = {};
    
    if (searchParams.aadharNumber) {
        params.aadharNumber = searchParams.aadharNumber;
    }
    if (searchParams.uniqueVoterId) {
        params.uniqueVoterId = searchParams.uniqueVoterId;
    }
    if (searchParams.phoneNumber) {
        params.phoneNumber = searchParams.phoneNumber;
    }
    
    console.log("Searching with params:", params);
    
    try {
        const response = await api.get("/voters/search", { params });
        console.log("API response:", response);
        return response.data;
    } catch (error) {
        console.error("API error:", error);
        throw new Error(error.response?.data?.message || "Failed to search voters");
    }
};
