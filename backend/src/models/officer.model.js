import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const officerSchema = new Schema(
    {
        role: {
            type: String,
            enum: ["BLO", "ERO", "DEO", "CEO", "ECI HQ"],
            required: true
        },
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
            maxlength: 10,
            // required: true
        },
        postingAddress: {
            state: {
                type: String,
                // required: true
            },
            district: {
                type: String,
                // required: true
            },
            assembley: {
                type: String,
                // required: true
            },
            consituency: {
                type: String,
                // required: true
            },
        },
    },
    { timestamps: true }
);

officerSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

officerSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return token;
}

officerSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
}

export const Officer = model("Officer", officerSchema);