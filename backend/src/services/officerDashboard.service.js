import { User } from "../models/user.model.js";
import { Voter } from "../models/voter.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateVoterId } from "../utils/voter.js";

let migrationDone = false;

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
    if (migrationDone) return 0;
    
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

    migrationDone = true;
    return usersWithoutVerification.length;
};

export const getPendingUsersForBLO = async (officer) => {
    await migrateUsersVerification();
    // const addressFilter = buildAddressFilter(officer);
    
    // const users = await User.find({
    //     ...addressFilter
    // }).lean();

    // const filteredUsers = users.filter(user => {
    //     const verification = user.verification || [];
    //     const bloVerification = verification.find(v => v.level === "BLO");
    //     const hasRejected = verification.some(v => v.level === "BLO" && v.status === "rejected");
    //     return bloVerification && bloVerification.status === "pending" && !hasRejected;
    // });

    // return filteredUsers;

    const users = await User.find({
        "verification": {
            $elemMatch: {
                level: "BLO",
                status: "pending"
            }
        },
        // ...addressFilter
    }).lean();

    return users;
};

// export const getPendingUsersForERO = async (officer) => {
//     await migrateUsersVerification();
//     // const addressFilter = buildAddressFilter(officer);
    
//     // const users = await User.find({
//     //     ...addressFilter
//     // }).lean();

//     // const filteredUsers = users.filter(user => {
//     //     const verification = user.verification || [];
//     //     const bloVerification = verification.find(v => v.level === "BLO");
//     //     const eroVerification = verification.find(v => v.level === "ERO");
//     //     const hasRejected = verification.some(v => v.level === "ERO" && v.status === "rejected");
        
//     //     return bloVerification?.status === "verified" && 
//     //            eroVerification?.status === "pending" &&
//     //            !hasRejected;
//     // });

//     // return filteredUsers;

//     const users = await User.find({
//         "verification": {
//             $elemMatch: {
//                 level: "ERO",
//                 status: "pending"
//             },
//             $elemMatch: {
//                 level: "BLO",
//                 status: "verified"
//             }
//         },
//         // ...addressFilter
//     }).lean();

//     return users;
// };

// export const getPendingUsersForDEO = async (officer) => {
//     await migrateUsersVerification();
//     // const addressFilter = buildAddressFilter(officer);
    
//     // const users = await User.find({
//     //     ...addressFilter
//     // }).lean();

//     // const filteredUsers = users.filter(user => {
//     //     const verification = user.verification || [];
//     //     const bloVerification = verification.find(v => v.level === "BLO");
//     //     const eroVerification = verification.find(v => v.level === "ERO");
//     //     const deoVerification = verification.find(v => v.level === "DEO");
//     //     const hasRejected = verification.some(v => v.level === "DEO" && v.status === "rejected");
        
//     //     return bloVerification?.status === "verified" && 
//     //            eroVerification?.status === "verified" && 
//     //            deoVerification?.status === "pending" &&
//     //            !hasRejected;
//     // });

//     // return filteredUsers;

//     const users = await User.find({
//         "verification": {
//             $elemMatch: {
//                 level: "DEO",
//                 status: "pending"
//             },
//             $elemMatch: {
//                 level: "BLO",
//                 status: "verified"
//             },
//             $elemMatch: {
//                 level: "ERO",
//                 status: "verified"
//             }
//         },
//         // ...addressFilter
//     }).lean();

//     return users;
// };

export const getPendingUsersForERO = async () => {
    await migrateUsersVerification();

    return await User.find({
        verification: {
            $all: [
                { $elemMatch: { level: "BLO", status: "verified" } },
                { $elemMatch: { level: "ERO", status: "pending" } }
            ]
        }
    }).lean();
};

export const getPendingUsersForDEO = async () => {
    await migrateUsersVerification();

    const users = await User.find({
        $and: [
            {
                verification: {
                    $all: [
                        { $elemMatch: { level: "BLO", status: "verified" } },
                        { $elemMatch: { level: "ERO", status: "verified" } },
                        { $elemMatch: { level: "DEO", status: "pending" } }
                    ]
                }
            },
            {
                verification: {
                    $not: {
                        $elemMatch: {
                            level: "DEO",
                            status: "rejected"
                        }
                    }
                }
            }
        ]
    }).lean();

    return users;
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
        uniqueVoterId = generateVoterId(user.state || "UNK");
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

    const voterData = {
        state: userObj.state || "",
        district: userObj.district || userObj.address?.district || "",
        assembley: userObj.assembley || "",
        boothNumber: userObj.boothNumber || "",
        consituency: userObj.consituency || "",
        firstName: userObj.firstName || "",
        lastName: userObj.lastName || "",
        imageUrl: userObj.imageUrl || "",
        password: userObj.password || userObj.aadharNumber,
        relative: userObj.relative || { type: "father", name: "Not Provided" },
        phoneNumber: userObj.phoneNumber || "",
        email: userObj.email || "",
        aadharNumber: userObj.aadharNumber || "",
        gender: userObj.gender || "other",
        dob: userObj.dob || new Date(),
        address: {
            houseNumber: userObj.address?.houseNumber || "",
            village: userObj.address?.village || "",
            tehsil: userObj.address?.tehsil || "",
            postOffice: userObj.address?.postOffice || "",
            policeStation: userObj.address?.policeStation || "",
            district: userObj.address?.district || userObj.district || "",
            state: userObj.address?.state || userObj.state || "",
            pincode: userObj.address?.pincode || ""
        },
        disability: {
            type: userObj.disability?.type || "none",
            certificate: userObj.disability?.certificate || ""
        },
        referenceId: userObj.referenceId || "",
        uniqueVoterId: uniqueVoterId
    };

    const voter = await Voter.create(voterData);
    
    if (!voter) {
        throw new ApiError(500, "Failed to create voter");
    }

    return voter;
};

export const convertVerifiedUserToVoter = async (userId) => {
    const user = await User.findById(userId);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const verification = user.verification || [];
    const bloVerification = verification.find(v => v.level === "BLO");
    const eroVerification = verification.find(v => v.level === "ERO");
    const deoVerification = verification.find(v => v.level === "DEO");

    if (bloVerification?.status !== "verified" || 
        eroVerification?.status !== "verified" || 
        deoVerification?.status !== "verified") {
        throw new ApiError(400, "User must be verified by BLO, ERO, and DEO first");
    }

    const existingVoter = await Voter.findOne({ aadharNumber: user.aadharNumber });
    if (existingVoter) {
        throw new ApiError(400, "Voter already exists for this user");
    }

    let uniqueVoterId;
    while (true) {
        uniqueVoterId = generateVoterId(user.state || "UNK");
        const existing = await Voter.findOne({ uniqueVoterId });
        if (!existing) break;
    }

    const userObj = user.toObject();
    delete userObj._id;
    delete userObj.__v;
    delete userObj.verification;

    const voterData = {
        state: userObj.state || "",
        district: userObj.district || userObj.address?.district || "",
        assembley: userObj.assembley || "",
        boothNumber: userObj.boothNumber || "",
        consituency: userObj.consituency || "",
        firstName: userObj.firstName || "",
        lastName: userObj.lastName || "",
        imageUrl: userObj.imageUrl || "",
        password: userObj.password || userObj.aadharNumber,
        relative: userObj.relative || { type: "father", name: "Not Provided" },
        phoneNumber: userObj.phoneNumber || "",
        email: userObj.email || "",
        aadharNumber: userObj.aadharNumber || "",
        gender: userObj.gender || "other",
        dob: userObj.dob || new Date(),
        address: {
            houseNumber: userObj.address?.houseNumber || "",
            village: userObj.address?.village || "",
            tehsil: userObj.address?.tehsil || "",
            postOffice: userObj.address?.postOffice || "",
            policeStation: userObj.address?.policeStation || "",
            district: userObj.address?.district || userObj.district || "",
            state: userObj.address?.state || userObj.state || "",
            pincode: userObj.address?.pincode || ""
        },
        disability: {
            type: userObj.disability?.type || "none",
            certificate: userObj.disability?.certificate || ""
        },
        referenceId: userObj.referenceId || "",
        uniqueVoterId: uniqueVoterId
    };

    const voter = await Voter.create(voterData);
    
    if (!voter) {
        throw new ApiError(500, "Failed to create voter");
    }

    return voter;
};

export const convertAllVerifiedUsersToVoters = async () => {
    const users = await User.find({
        "verification.level": "DEO",
        "verification.status": "verified"
    }).lean();

    const converted = [];
    const failed = [];

    for (const user of users) {
        try {
            const existingVoter = await Voter.findOne({ aadharNumber: user.aadharNumber });
            if (existingVoter) continue;

            const verification = user.verification || [];
            const bloVerification = verification.find(v => v.level === "BLO");
            const eroVerification = verification.find(v => v.level === "ERO");
            const deoVerification = verification.find(v => v.level === "DEO");

            if (bloVerification?.status !== "verified" || 
                eroVerification?.status !== "verified" || 
                deoVerification?.status !== "verified") {
                continue;
            }

            let uniqueVoterId;
            while (true) {
                uniqueVoterId = generateVoterId(user.state || "UNK");
                const existing = await Voter.findOne({ uniqueVoterId });
                if (!existing) break;
            }

            const userObj = { ...user };
            delete userObj._id;
            delete userObj.__v;
            delete userObj.verification;

            const voterData = {
                state: userObj.state || "",
                district: userObj.district || userObj.address?.district || "",
                assembley: userObj.assembley || "",
                boothNumber: userObj.boothNumber || "",
                consituency: userObj.consituency || "",
                firstName: userObj.firstName || "",
                lastName: userObj.lastName || "",
                imageUrl: userObj.imageUrl || "",
                password: userObj.password || userObj.aadharNumber,
                relative: userObj.relative || { type: "father", name: "Not Provided" },
                phoneNumber: userObj.phoneNumber || "",
                email: userObj.email || "",
                aadharNumber: userObj.aadharNumber || "",
                gender: userObj.gender || "other",
                dob: userObj.dob || new Date(),
                address: {
                    houseNumber: userObj.address?.houseNumber || "",
                    village: userObj.address?.village || "",
                    tehsil: userObj.address?.tehsil || "",
                    postOffice: userObj.address?.postOffice || "",
                    policeStation: userObj.address?.policeStation || "",
                    district: userObj.address?.district || userObj.district || "",
                    state: userObj.address?.state || userObj.state || "",
                    pincode: userObj.address?.pincode || ""
                },
                disability: {
                    type: userObj.disability?.type || "none",
                    certificate: userObj.disability?.certificate || ""
                },
                referenceId: userObj.referenceId || "",
                uniqueVoterId: uniqueVoterId
            };

            await Voter.create(voterData);
            converted.push(user.aadharNumber);
        } catch (error) {
            failed.push({ aadharNumber: user.aadharNumber, error: error.message });
        }
    }

    return { converted, failed };
};
