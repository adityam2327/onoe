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

export const getStatesList = async () => {
    try {
        const response = await api.get("/states");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch states");
    }
};

export const getAllPCS = async (params = {}) => {
    try {
        const response = await api.get("/pcs/all", { params });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch parliamentary constituencies");
    }
};

export const getAllPCsList = async () => {
    try {
        const response = await api.get("/pcs/list");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch parliamentary constituencies");
    }
};

export const getAllACS = async (params = {}) => {
    try {
        const response = await api.get("/acs/all", { params });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch assembly constituencies");
    }
};

export const getAllACsList = async () => {
    try {
        const response = await api.get("/acs/list");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch assembly constituencies");
    }
};

export const createPC = async (data) => {
    try {
        const response = await api.post("/pcs/create", data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create PC");
    }
};

export const updatePC = async (id, data) => {
    try {
        const response = await api.put(`/pcs/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to update PC");
    }
};

export const deletePC = async (id) => {
    try {
        const response = await api.delete(`/pcs/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to delete PC");
    }
};

export const createAC = async (data) => {
    try {
        const response = await api.post("/acs/create", data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create AC");
    }
};

export const updateAC = async (id, data) => {
    try {
        const response = await api.put(`/acs/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to update AC");
    }
};

export const deleteAC = async (id) => {
    try {
        const response = await api.delete(`/acs/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to delete AC");
    }
};

export const getAllMobilityBooths = async (params = {}) => {
    try {
        const response = await api.get("/mobility-booths/all", { params });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch mobility booths");
    }
};

export const createMobilityBooth = async (data) => {
    try {
        const response = await api.post("/mobility-booths/create", data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create mobility booth");
    }
};

export const updateMobilityBooth = async (id, data) => {
    try {
        const response = await api.put(`/mobility-booths/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to update mobility booth");
    }
};

export const deleteMobilityBooth = async (id) => {
    try {
        const response = await api.delete(`/mobility-booths/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to delete mobility booth");
    }
};

export const getAllStates = async (params = {}) => {
    try {
        const response = await api.get("/states/all", { params });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch states");
    }
};

export const createState = async (data) => {
    try {
        const response = await api.post("/states/create", data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to create state");
    }
};

export const updateState = async (id, data) => {
    try {
        const response = await api.put(`/states/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to update state");
    }
};

export const deleteState = async (id) => {
    try {
        const response = await api.delete(`/states/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to delete state");
    }
};
