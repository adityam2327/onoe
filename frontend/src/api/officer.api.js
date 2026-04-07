import api from "@/lib/axios";

export const createOfficer = async (officerData) => {
    try {
        const response = await api.post("/officers/create", officerData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create officer");
    }
}

export const loginOfficer = async (credentials) => {
    try {
        const response = await api.post("/officers/login", credentials);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to login");
    }
};

export const getCurrentOfficer = async () => {
    try {
        const response = await api.get("/officers/me");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch officer");
    }
};

export const getMyOfficers = async () => {
    try {
        const response = await api.get("/officers/my-officers");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch officers");
    }
};

export const getOfficersByRole = async (role) => {
    try {
        const response = await api.get(`/officers/role/${role}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch officers");
    }
};

export const getECIStats = async () => {
    try {
        const response = await api.get("/dashboard/eci-stats");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch stats");
    }
};

export const getCEOStats = async () => {
    try {
        const response = await api.get("/dashboard/ceo-stats");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch CEO stats");
    }
};

export const getDEOStats = async () => {
    try {
        const response = await api.get("/dashboard/deo-stats");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch DEO stats");
    }
};

export const getEROStats = async () => {
    try {
        const response = await api.get("/dashboard/ero-stats");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch ERO stats");
    }
};

export const getBLOStats = async () => {
    try {
        const response = await api.get("/dashboard/blo-stats");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch BLO stats");
    }
};
