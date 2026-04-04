import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { genrateUniqueReferenceId } from "../utils/user.util.js";
import axios from "axios";
import FormData from "form-data";
import { Voter } from "../models/voter.model.js";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const performAsyncVerification = async (userId, imageUrl, attempt = 1) => {
    const MAX_RETRIES = 3; // 1 initial + 2 retries

    try {
        console.log(`AI Verification started (Attempt ${attempt}) for:`, userId);

        if (!imageUrl) {
            throw new Error("Image URL missing");
        }

        let formData = new FormData();

        const imageResponse = await axios.get(imageUrl, {
            responseType: "arraybuffer",
            timeout: 300000 // image fetch timeout (5 mins)
        });

        formData.append("file", Buffer.from(imageResponse.data), "image.jpg");

        const response = await axios.post(
            `${process.env.AI_VERIFICATION_API_URL}/verify-user`,
            formData,
            {
                headers: formData.getHeaders(),
                timeout: 300000 // ✅ 5 minutes
            }
        );

        console.log("AI Response:", response.data);

        const updateData = response.data?.exists
            ? {
                  $set: {
                      "verification.$[elem].status": "rejected",
                      "verification.$[elem].remarks":
                          "A user with similar facial features already exists",
                      "verification.$[elem].verifiedAt": new Date()
                  }
              }
            : {
                  $set: {
                      "verification.$[elem].status": "verified",
                      "verification.$[elem].remarks":
                          "Auto-verified by AI system - No similar facial features found",
                      "verification.$[elem].verifiedAt": new Date()
                  }
              };

        await User.updateOne(
            { _id: userId },
            updateData,
            { arrayFilters: [{ "elem.level": "AI" }] }
        );

        console.log("✅ AI verification completed for:", userId);

    } catch (error) {
        console.error(`❌ Attempt ${attempt} failed:`, error.message);

        if (attempt < MAX_RETRIES) {
            console.log(`🔁 Retrying... (${attempt + 1}/${MAX_RETRIES})`);

            await sleep(5000); // wait 5 sec before retry

            return performAsyncVerification(userId, imageUrl, attempt + 1);
        }

        console.error("🚫 All retries failed for:", userId);

        await User.updateOne(
            { _id: userId },
            {
                $set: {
                    "verification.$[elem].status": "rejected",
                    "verification.$[elem].remarks":
                        "AI verification failed after multiple attempts",
                    "verification.$[elem].verifiedAt": new Date()
                }
            },
            { arrayFilters: [{ "elem.level": "AI" }] }
        );
    }
};

export const createUserService = async (userData) => {
    const referenceId = genrateUniqueReferenceId();
    const verification = [
        { level: "BLO", status: "pending", remarks: "", verifiedAt: null },
        { level: "ERO", status: "pending", remarks: "", verifiedAt: null },
        { level: "DEO", status: "pending", remarks: "", verifiedAt: null },
        { level: "AI", status: "pending", remarks: "Verification in progress", verifiedAt: null }
        //{ level: "AI", status: "verified", remarks: "Auto-verified by AI system - No similar facial features found", verifiedAt: new Date() }
    ];

    // check if user with aadhar number, phone number or email already exists
    const existingUser = await User.findOne({
        $or: [
            { aadharNumber: userData.aadharNumber },
            { phoneNumber: userData.phoneNumber },
            { email: userData.email }
        ]
    });
    
    if (existingUser) {
        throw new ApiError(400, "User with same Aadhar number, phone number or email already exists");
    }

    // check if parent aadhar number exists in voters collection
    if (userData?.relative?.aadharNumber) {
        const relativeVoter = await Voter.findOne({ aadharNumber: userData.relative.aadharNumber });
        if (!relativeVoter) {
            throw new ApiError(400, "Relative with given Aadhar number does not exist in voters database");
        }
    }

    const user = await User.create({ ...userData, referenceId, verification });

    if (!user) {
        throw new ApiError(500, "Failed to create user");
    }

    setImmediate(() => {
        performAsyncVerification(user._id, userData.imageUrl)
            .catch(err => console.error("Background job crashed:", err));
    });

    return user;
};

export const getUsersService = async () => {
    const users = await User.find();

    if (!users) {
        throw new ApiError(404, "No users found");
    }

    return users;
}

export const getUserByIdService = async (id) => {
    const user = await User.findById(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};