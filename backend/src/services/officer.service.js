import { Officer } from "../models/officer.model.js";
import { ApiError } from "../utils/ApiError.js";

export const createOfficerService = async (currentOfficerData, newOfficerData) => {
    const { role: currentRole } = currentOfficerData;

    const roleHierarchy = {
        "ECI HQ": "CEO",
        "CEO": "DEO",
        "DEO": "ERO",
        "ERO": "BLO"
    };

    const allowedRole = roleHierarchy[currentRole];

    if (!allowedRole) {
        throw new ApiError(403, "You don't have permission to create officers");
    }

    const { role: newRole, ...otherData } = newOfficerData;

    if (newRole && newRole !== allowedRole) {
        throw new ApiError(400, `You can only create ${allowedRole} officers`);
    }

    const officerData = {
        ...otherData,
        role: allowedRole
    };

    const officer = await Officer.create(officerData);

    return officer;
}

export const loginOfficerService = async (email, password, role) => {
    const officer = await Officer.findOne({ email, role: role.toUpperCase() });

    if (!officer) {
        throw new ApiError(401, "Invalid credentials");
    }

    if (!officer.comparePassword(password)) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = officer.generateAuthToken();
    
    return { officer, token };
}

export const getOfficersByRoleService = async (role) => {
    const officers = await Officer.find({ role: role.toUpperCase() }).select("-password");
    return officers;
}

export const getMyOfficersService = async (currentOfficer) => {
    const { role } = currentOfficer;

    const roleHierarchy = {
        "ECI HQ": "CEO",
        "CEO": "DEO",
        "DEO": "ERO",
        "ERO": "BLO"
    };

    const childRole = roleHierarchy[role];

    if (!childRole) {
        return [];
    }

    const officers = await Officer.find({ role: childRole }).select("-password");
    return officers;
}
