import { Schema, model } from "mongoose";

const statesSchema = new Schema(
    {
        state_code: {
            type: String,
            required: true
        },
        state_name: {
            type: String,
            required: true
        },
        state_type: {
            type: String,
            required: true
        }
    }
);

export const States = model("States", statesSchema);
