const { getContract } = require("../blockchain");
const { hashString } = require("../utils/hash");

async function recordVerificationStep(req, res) {
    try {
        const { referenceId, officerRole, approved, remarks } = req.body;

        const validRoles = ["BLO", "ERO", "DEO", "AI"];

        if (!referenceId || !officerRole || typeof approved !== "boolean") {
            return res.status(400).json({
                success: false,
                error: "Missing or invalid fields: referenceId (string), officerRole (string), approved (boolean), remarks (string)"
            });
        }

        if (!validRoles.includes(officerRole.toUpperCase())) {
            return res.status(400).json({
                success: false,
                error: `officerRole must be one of: ${validRoles.join(", ")}`
            });
        }

        const referenceIdHash = hashString(referenceId);
        const contract = getContract();

        const tx = await contract.recordVerificationStep(
            referenceIdHash,
            officerRole.toUpperCase(),
            approved,
            remarks || ""
        );
        const receipt = await tx.wait();

        return res.status(200).json({
            success: true,
            message: "Verification step recorded on blockchain.",
            referenceIdHash,
            officerRole: officerRole.toUpperCase(),
            approved,
            remarks: remarks || "",
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber
        });
    } catch (err) {
        console.error("[recordVerificationStep]", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

module.exports = { recordVerificationStep };