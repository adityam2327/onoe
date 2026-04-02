import { Schema, model } from "mongoose";

const acsSchema = new Schema(
    {
        state_code: {
            type: String,
            required: true
        },
        pc_code: {
            type: String,
            required: true
        },
        assembly_code: {
            type: String,
            required: true
        },
        assembly_name: {
            type: String,
            required: true
        }
    }
);

export const Acs = model("Acs", acsSchema);
