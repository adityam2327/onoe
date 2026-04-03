import { User } from "../models/user.model.js";
import { Voter } from "../models/voter.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateVoterId, isUserFullyVerified } from "../utils/voter.js";

export const createVoterService = async (aadharNumber) => {
    const user = await User.findOne({ aadharNumber });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const voterExists = await Voter.findOne({ aadharNumber: user.aadharNumber });

    if (voterExists) {
        throw new ApiError(400, "Voter already exists for this user");
    }

    if (!isUserFullyVerified(user.verification)) {
        throw new ApiError(403, "User is not fully verified by all levels");
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

export const loginVoterService = async (uniqueVoterId, password) => {
    const voter = await Voter.findOne({ uniqueVoterId });

    if (!voter) {
        throw new ApiError(404, "Voter not found");
    }

    if (voter.password !== password) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = voter.generateAuthToken();

    return { voter, token };
}

export const getAllVotersService = async (page = 1, limit = 10, filter = {}) => {
    const skip = (page - 1) * limit;

    const [voters, total] = await Promise.all([
        Voter.find(filter)
            .select("-password")
            .skip(skip)
            .limit(limit)
            .lean(),
        Voter.countDocuments(filter)
    ]);

    return {
        voters,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const checkVoterAndUserViaAadharService = async (aadharNumber) => {
    // check are user or voter exists with this aadhar number and tell where it exists
    const user = await User.findOne({ aadharNumber });
    const voter = await Voter.findOne({ aadharNumber });
    
    return { user, voter };
}   