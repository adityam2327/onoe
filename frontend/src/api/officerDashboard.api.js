import api from "@/lib/axios";

export const getPendingUsers = async () => {
    try {
        const response = await api.get("/officer-dashboard/pending-users");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to fetch pending users");
    }
};

export const verifyUser = async (userId, remarks = "") => {
    try {
        const response = await api.post("/officer-dashboard/verify", { userId, remarks });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to verify user");
    }
};

export const rejectUser = async (userId, remarks) => {
    try {
        const response = await api.post("/officer-dashboard/reject", { userId, remarks });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to reject user");
    }
};
