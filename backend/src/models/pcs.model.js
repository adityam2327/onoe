import { Schema, model } from "mongoose";

const pcsSchema = new Schema(
    {
        state_code: {
            type: String,
            required: true
        },
        pc_code: {
            type: String,
            required: true
        },
        pc_name: {
            type: String,
            required: true
        }
    }
);

export const Pcs = model("Pcs", pcsSchema);
