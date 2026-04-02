import api from "@/lib/axios";

export const getAllBooths = async (params = {}) => {
    try {
        const response = await api.get("/booths/all", { params });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch booths");
    }
};

export const createBooth = async (data) => {
    try {
        const response = await api.post("/booths/create", data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create booth");
    }
};

export const updateBooth = async (id, data) => {
    try {
        const response = await api.put(`/booths/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to update booth");
    }
};

export const deleteBooth = async (id) => {
    try {
        const response = await api.delete(`/booths/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to delete booth");
    }
};

export const getStates = async () => {
    try {
        const response = await api.get("/states");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch states");
    }
};

export const getAllPCS = async () => {
    try {
        const response = await api.get("/pcs/all");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch parliamentary constituencies");
    }
};

export const getAllACS = async () => {
    try {
        const response = await api.get("/acs/all");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch assembly constituencies");
    }
};
