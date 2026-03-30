import crypto from "crypto";

export const genrateUniqueReferenceId = () => {
    const uniqueReferenceId = `ONOE-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    return uniqueReferenceId;
};