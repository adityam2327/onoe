import { User } from "../models/user.model.js";
import { Voter } from "../models/voter.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateVoterId } from "../utils/voter.js";

const buildAddressFilter = (officer) => {
    const filter = {};
    if (officer.postingAddress?.state) {
        filter["address.state"] = officer.postingAddress.state;
    }
    if (officer.postingAddress?.district) {
        filter["address.district"] = officer.postingAddress.district;
    }
    if (officer.postingAddress?.assembley) {
        filter["assembley"] = officer.postingAddress.assembley;
    }
    if (officer.postingAddress?.consituency) {
        filter["consituency"] = officer.postingAddress.consituency;
    }
    if (officer.postingAddress?.boothNumber) {
        filter["boothNumber"] = officer.postingAddress.boothNumber;
    }
    return filter;
};

const defaultVerification = [
    { level: "BLO", status: "pending", remarks: "", verifiedAt: null },
    { level: "ERO", status: "pending", remarks: "", verifiedAt: null },
    { level: "DEO", status: "pending", remarks: "", verifiedAt: null },
    { level: "AI", status: "pending", remarks: "", verifiedAt: null }
];

export const migrateUsersVerification = async () => {
    const usersWithoutVerification = await User.find({
        $or: [
            { verification: { $exists: false } },
            { verification: { $size: 0 } }
        ]
    });

    for (const user of usersWithoutVerification) {
        user.verification = defaultVerification;
        await user.save();
    }

    return usersWithoutVerification.length;
};

export const getPendingUsersForBLO = async (officer) => {
    await migrateUsersVerification();
    const addressFilter = buildAddressFilter(officer);
    
    const users = await User.find({
        ...addressFilter,
        verification: {
            $elemMatch: {
                level: "BLO",
                status: "pending"
            }
        }
    }).lean();

    const filteredUsers = users.filter(user => {
        const bloVerification = user.verification.find(v => v.level === "BLO");
        const hasRejected = user.verification.some(v => v.level === "BLO" && v.status === "rejected");
        return bloVerification && bloVerification.status === "pending" && !hasRejected;
    });

    return filteredUsers;
};

export const getPendingUsersForERO = async (officer) => {
    await migrateUsersVerification();
    const addressFilter = buildAddressFilter(officer);
    
    const users = await User.find({
        ...addressFilter,
        verification: {
            $all: [
                { $elemMatch: { level: "BLO", status: "verified" } },
                { $elemMatch: { level: "ERO", status: "pending" } }
            ]
        }
    }).lean();

    const filteredUsers = users.filter(user => {
        const bloVerification = user.verification.find(v => v.level === "BLO");
        const eroVerification = user.verification.find(v => v.level === "ERO");
        const hasRejected = user.verification.some(v => v.level === "ERO" && v.status === "rejected");
        
        return bloVerification?.status === "verified" && 
               eroVerification?.status === "pending" &&
               !hasRejected;
    });

    return filteredUsers;
};

export const getPendingUsersForDEO = async (officer) => {
    await migrateUsersVerification();
    const addressFilter = buildAddressFilter(officer);
    
    const users = await User.find({
        ...addressFilter,
        verification: {
            $all: [
                { $elemMatch: { level: "BLO", status: "verified" } },
                { $elemMatch: { level: "ERO", status: "verified" } },
                { $elemMatch: { level: "DEO", status: "pending" } }
            ]
        }
    }).lean();

    const filteredUsers = users.filter(user => {
        const bloVerification = user.verification.find(v => v.level === "BLO");
        const eroVerification = user.verification.find(v => v.level === "ERO");
        const deoVerification = user.verification.find(v => v.level === "DEO");
        const hasRejected = user.verification.some(v => v.level === "DEO" && v.status === "rejected");
        
        return bloVerification?.status === "verified" && 
               eroVerification?.status === "verified" && 
               deoVerification?.status === "pending" &&
               !hasRejected;
    });

    return filteredUsers;
};

export const verifyUserByBLO = async (userId, remarks) => {
    const user = await User.findById(userId);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const bloVerification = user.verification.find(v => v.level === "BLO");
    
    if (!bloVerification) {
        throw new ApiError(400, "BLO verification not found");
    }

    if (bloVerification.status !== "pending") {
        throw new ApiError(400, "User has already been verified/rejected by BLO");
    }

    bloVerification.status = "verified";
    bloVerification.remarks = remarks || "";
    bloVerification.verifiedAt = new Date();

    await user.save();
    
    return user;
};

export const rejectUserByBLO = async (userId, remarks) => {
    if (!remarks) {
        throw new ApiError(400, "Remarks are required when rejecting a user");
    }

    const user = await User.findById(userId);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const bloVerification = user.verification.find(v => v.level === "BLO");
    
    if (!bloVerification) {
        throw new ApiError(400, "BLO verification not found");
    }

    if (bloVerification.status !== "pending") {
        throw new ApiError(400, "User has already been verified/rejected by BLO");
    }

    bloVerification.status = "rejected";
    bloVerification.remarks = remarks;
    bloVerification.verifiedAt = new Date();

    await user.save();
    
    return user;
};

export const verifyUserByERO = async (userId, remarks) => {
    const user = await User.findById(userId);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const bloVerification = user.verification.find(v => v.level === "BLO");
    const eroVerification = user.verification.find(v => v.level === "ERO");
    
    if (bloVerification?.status !== "verified") {
        throw new ApiError(400, "User must be verified by BLO first");
    }

    if (!eroVerification) {
        throw new ApiError(400, "ERO verification not found");
    }

    if (eroVerification.status !== "pending") {
        throw new ApiError(400, "User has already been verified/rejected by ERO");
    }

    eroVerification.status = "verified";
    eroVerification.remarks = remarks || "";
    eroVerification.verifiedAt = new Date();

    await user.save();
    
    return user;
};

export const rejectUserByERO = async (userId, remarks) => {
    if (!remarks) {
        throw new ApiError(400, "Remarks are required when rejecting a user");
    }

    const user = await User.findById(userId);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const bloVerification = user.verification.find(v => v.level === "BLO");
    const eroVerification = user.verification.find(v => v.level === "ERO");
    
    if (bloVerification?.status !== "verified") {
        throw new ApiError(400, "User must be verified by BLO first");
    }

    if (!eroVerification) {
        throw new ApiError(400, "ERO verification not found");
    }

    if (eroVerification.status !== "pending") {
        throw new ApiError(400, "User has already been verified/rejected by ERO");
    }

    eroVerification.status = "rejected";
    eroVerification.remarks = remarks;
    eroVerification.verifiedAt = new Date();

    await user.save();
    
    return user;
};

export const verifyUserByDEO = async (userId, remarks) => {
    const user = await User.findById(userId);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const bloVerification = user.verification.find(v => v.level === "BLO");
    const eroVerification = user.verification.find(v => v.level === "ERO");
    const deoVerification = user.verification.find(v => v.level === "DEO");
    
    if (bloVerification?.status !== "verified") {
        throw new ApiError(400, "User must be verified by BLO first");
    }

    if (eroVerification?.status !== "verified") {
        throw new ApiError(400, "User must be verified by ERO first");
    }

    if (!deoVerification) {
        throw new ApiError(400, "DEO verification not found");
    }

    if (deoVerification.status !== "pending") {
        throw new ApiError(400, "User has already been verified/rejected by DEO");
    }

    deoVerification.status = "verified";
    deoVerification.remarks = remarks || "";
    deoVerification.verifiedAt = new Date();

    await user.save();
    
    const voter = await convertUserToVoter(user);
    
    return { user, voter };
};

export const rejectUserByDEO = async (userId, remarks) => {
    if (!remarks) {
        throw new ApiError(400, "Remarks are required when rejecting a user");
    }

    const user = await User.findById(userId);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const bloVerification = user.verification.find(v => v.level === "BLO");
    const eroVerification = user.verification.find(v => v.level === "ERO");
    const deoVerification = user.verification.find(v => v.level === "DEO");
    
    if (bloVerification?.status !== "verified") {
        throw new ApiError(400, "User must be verified by BLO first");
    }

    if (eroVerification?.status !== "verified") {
        throw new ApiError(400, "User must be verified by ERO first");
    }

    if (!deoVerification) {
        throw new ApiError(400, "DEO verification not found");
    }

    if (deoVerification.status !== "pending") {
        throw new ApiError(400, "User has already been verified/rejected by DEO");
    }

    deoVerification.status = "rejected";
    deoVerification.remarks = remarks;
    deoVerification.verifiedAt = new Date();

    await user.save();
    
    return user;
};

export const convertUserToVoter = async (user) => {
    const voterExists = await Voter.findOne({ aadharNumber: user.aadharNumber });
    
    if (voterExists) {
        throw new ApiError(400, "Voter already exists for this user");
    }

    let uniqueVoterId;
    while (true) {
        uniqueVoterId = generateVoterId(user.state);
        const existingVoter = await Voter.findOne({ uniqueVoterId });
        if (!existingVoter) {
            break;
        }
    }

    const userObj = user.toObject();
    delete userObj._id;
    delete userObj.__v;
    delete userObj.verification;
    userObj.uniqueVoterId = uniqueVoterId;

    const voter = await Voter.create(userObj);
    
    if (!voter) {
        throw new ApiError(500, "Failed to create voter");
    }

    return voter;
};
