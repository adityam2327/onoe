import { Schema, model } from "mongoose";

const boothsSchema = new Schema(
    {
        ac_code: {
            type: String,
            required: true
        },
        booth_no: {
            type: String,
            required: true
        },
        booth_name: {
            type: String,
            required: true
        }
    }
);

export const Booths = model("Booths", boothsSchema);
