import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const pollingBoothOfficerSchema = new Schema(
    {
        name: {
            type: String,
            minlength: 3,
            maxlength: 50,
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
        password: {
            type: String,
            minlength: 6,
            maxlength: 1024,
            required: true
        },
        phoneNumber: {
            type: String,
            trim: true,
            minlength: 10,
            maxlength: 10
        },
        assignmentType: {
            type: String,
            enum: ["booth", "mobility_booth"],
            required: true
        },
        booth: {
            type: Schema.Types.ObjectId,
            ref: "Booths"
        },
        mobilityBooth: {
            type: Schema.Types.ObjectId,
            ref: "MobilityBooths"
        },
        state: {
            type: String
        },
        district: {
            type: String
        },
        assembly: {
            type: String
        },
        constituency: {
            type: String
        },
        isAssigned: {
            type: Boolean,
            default: false
        },
        ero: {
            type: Schema.Types.ObjectId,
            ref: "Officer"
        }
    },
    { timestamps: true }
);

pollingBoothOfficerSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

pollingBoothOfficerSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ id: this._id, role: "POLLING_BOOTH_OFFICER" }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return token;
}

pollingBoothOfficerSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
}

export const PollingBoothOfficer = model("PollingBoothOfficer", pollingBoothOfficerSchema);
