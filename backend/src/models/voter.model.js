import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";

const voterSchema = new Schema(
    {
        state: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        assembley: {
            type: String,
            required: true
        },
        boothNumber: {
            type: String,
            required: true
        },
        consituency: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            minlength: 3,
            maxlength: 50,
            required: true
        },
        lastName: {
            type: String,
            minlength: 3,
            maxlength: 50,
            required: true
        },
        imageUrl: {
            type: String,
            default: ""
        },
        password: {
            type: String,
            minlength: 6,
            maxlength: 1024,
            required: true
        },

        relative: {
            type: {
                type: String,
                enum: ["father", "mother", "spouse", "brother", "sister", "son", "daughter"],
                required: true
            },
            name: {
                type: String,
                minlength: 3,
                maxlength: 50,
                required: true
            }
        },

        phoneNumber: {
            type: String,
            trim: true,
            minlength: 10,
            maxlength: 10,
            required: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            minlength: 5,
            maxlength: 255,
            unique: true,
            required: true
        },
        aadharNumber: {
            type: String,
            trim: true,
            minlength: 12,
            maxlength: 12,
            unique: true,
            required: true
        },
        
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true
        },
        dob: {
            type: Date,
            required: true
        },

        address: {
            houseNumber: {
                type: String,
                required: true
            },
            village: {
                type: String,
                required: true
            },
            tehsil: {
                type: String,
                required: true
            },
            postOffice: {
                type: String,
                required: true
            },
            policeStation: {
                type: String,
                required: true
            },
            district: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            pincode: {
                type: String,
                trim: true,
                minlength: 6,
                maxlength: 6,
                required: true
            }
        },

        disability: {
            type: {
                type: String,
                enum: ["none", "visual", "hearing", "locomotor", "mental"],
                required: true
            },
            certificate: {
                type: String,
                default: ""
            }
        },

        uniqueVoterId: {
            type: String,
            unique: true,
        },

        referenceId: {
            type: String,
            unique: true,
            required: true
        },
        mobilityBoothId: {
            type: String,
            default: null
        },
        isVerifiedMobilityBoothId: {
            type: Boolean,
            default: false
        }
    }
);

voterSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { _id: this._id, email: this.email, role: "voter" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
}

export const Voter = model("Voter", voterSchema);