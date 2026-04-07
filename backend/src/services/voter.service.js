import { User } from "../models/user.model.js";
import { Voter } from "../models/voter.model.js";
import { MobilityBooths } from "../models/mobility_booths.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateVoterId, isUserFullyVerified } from "../utils/voter.js";
import axios from "axios";
import FormData from "form-data";

const performAsyncVoterVerification = async (imageUrl, aadharNumber) => {
    try {
        const formData = new FormData();
        if (imageUrl) {
            const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
            formData.append("file", Buffer.from(imageResponse.data), "image.jpg");
        }
        formData.append("name", aadharNumber);

        await axios.post(`${process.env.AI_VERIFICATION_API_URL}/add-voter`, formData, {
            headers: formData.getHeaders()
        });
    } catch (error) {
        console.error("Voter AI verification failed:", error.message);
    }
};

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

    // performAsyncVoterVerification(user.imageUrl, user.aadharNumber);

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
    
    const baseFilter = { isDeleted: false };
    const finalFilter = { ...baseFilter, ...filter };

    const [voters, total] = await Promise.all([
        Voter.find(finalFilter)
            .select("-password")
            .skip(skip)
            .limit(limit)
            .lean(),
        Voter.countDocuments(finalFilter)
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

export const getVotersByStateService = async (state, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const filter = { state, isDeleted: false };

    const [voters, total, districts, assemblies] = await Promise.all([
        Voter.find(filter)
            .select("-password")
            .skip(skip)
            .limit(limit)
            .lean(),
        Voter.countDocuments(filter),
        Voter.distinct("district", { state }),
        Voter.distinct("assembley", { state })
    ]);

    return {
        voters,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        },
        stats: {
            totalVoters: total,
            totalDistricts: districts.length,
            totalAssemblies: assemblies.length
        }
    };
};

export const checkVoterAndUserViaAadharService = async (aadharNumber) => {
    // check are user or voter exists with this aadhar number and tell where it exists
    const user = await User.findOne({ aadharNumber });
    const voter = await Voter.findOne({ aadharNumber });
    
    return { user, voter };
}   

export const getVotersByBoothIdService = async (boothId) => {
    if (!boothId) {
        throw new ApiError(400, "Please provide boothId");
    }

    let voters = await Voter.find({ mobilityBoothId: boothId, isDeleted: false }).select("-password");

    if (voters.length === 0) {
        voters = await Voter.find({ boothNumber: boothId, isDeleted: false }).select("-password");
    }

    return voters;
};

export const assignMobilityBoothService = async (voterId, boothId) => {
    const voter = await Voter.findOne({ uniqueVoterId: voterId });
    if (!voter) {
        throw new ApiError(404, "Voter not found");
    }

    const mobilityBooth = await MobilityBooths.findOne({ boothId });

    if (!mobilityBooth) {
        throw new ApiError(404, "Mobility booth not found");
    }

    voter.mobilityBoothId = boothId;
    voter.isVerifiedMobilityBoothId = false;

    await voter.save();

    return voter;
};

export const verifyMobilityBoothService = async (voterId, isVerified) => {
    const voter = await Voter.findById(voterId);

    if (!voter) {
        throw new ApiError(404, "Voter not found");
    }

    voter.isVerifiedMobilityBoothId = isVerified;
    await voter.save();

    return voter;
};

export const getMobilityBoothRequestsService = async () => {
    const voters = await Voter.find({
        mobilityBoothId: { $ne: null },
        isVerifiedMobilityBoothId: false,
        isDeleted: false
    }).select("-password");

    return voters;
};   

export const markVoterAsDeletedService = async (voterId, reason, officerName) => {
    const voter = await Voter.findById(voterId);
    
    if (!voter) {
        throw new ApiError(404, "Voter not found");
    }
    
    if (voter.isDeleted) {
        throw new ApiError(400, "Voter is already marked as deleted");
    }
    
    voter.isDeleted = true;
    voter.deletedAt = new Date();
    voter.deletionReason = reason;
    voter.deletedBy = officerName;
    
    await voter.save();
    
    return voter;
};

export const getDeletedVotersService = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [voters, total] = await Promise.all([
        Voter.find({ isDeleted: true })
            .select("-password")
            .skip(skip)
            .limit(limit)
            .lean(),
        Voter.countDocuments({ isDeleted: true })
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

export const searchVotersService = async (searchParams) => {
    const { phoneNumber, aadharNumber, uniqueVoterId, name } = searchParams;
    
    const filter = { isDeleted: false };
    
    if (phoneNumber) {
        filter.phoneNumber = phoneNumber;
    }
    if (aadharNumber) {
        filter.aadharNumber = aadharNumber;
    }
    if (uniqueVoterId) {
        filter.uniqueVoterId = uniqueVoterId;
    }
    if (name) {
        filter.$or = [
            { firstName: { $regex: name, $options: "i" } },
            { lastName: { $regex: name, $options: "i" } }
        ];
    }

    const voters = await Voter.find(filter)
        .select("-password")
        .lean()
        .limit(20);


    return voters;
};   