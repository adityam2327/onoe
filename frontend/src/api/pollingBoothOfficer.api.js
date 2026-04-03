import api from "@/lib/axios";

export const createPollingBoothOfficer = async (officerData) => {
    try {
        const response = await api.post("/polling-booth-officers/create", officerData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create polling booth officer");
    }
};

export const loginPollingBoothOfficer = async (credentials) => {
    try {
        const response = await api.post("/polling-booth-officers/login", credentials);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to login");
    }
};

export const getMyPollingBoothOfficers = async () => {
    try {
        const response = await api.get("/polling-booth-officers/my-polling-booth-officers");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch polling booth officers");
    }
};

export const getBoothsForAssignment = async () => {
    try {
        const response = await api.get("/polling-booth-officers/booths");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch booths");
    }
};

export const getMobilityBoothsForAssignment = async () => {
    try {
        const response = await api.get("/polling-booth-officers/mobility-booths");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch mobility booths");
    }
};

export const assignBoothToOfficer = async (officerId, boothId) => {
    try {
        const response = await api.post("/polling-booth-officers/assign-booth", { officerId, boothId });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to assign booth");
    }
};

export const assignMobilityBoothToOfficer = async (officerId, mobilityBoothId) => {
    try {
        const response = await api.post("/polling-booth-officers/assign-mobility-booth", { officerId, mobilityBoothId });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to assign mobility booth");
    }
};
