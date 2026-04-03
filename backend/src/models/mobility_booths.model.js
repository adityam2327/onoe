import { Schema, model } from "mongoose";

const mobilityBoothsSchema = new Schema(
    {
        boothId: {
            type: String,
            required: true,
            unique: true
        },
        boothName: {
            type: String,
            required: true
        },
        areaName: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        contactPerson: {
            type: String,
            required: true
        },
        contactPhone: {
            type: String,
            required: true
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        totalCapacity: {
            type: Number,
            required: true
        },
        currentQueue: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    }
);

mobilityBoothsSchema.index({ location: "2dsphere" });

export const MobilityBooths = model("mobility_booths", mobilityBoothsSchema);
