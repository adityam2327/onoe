const { getContract } = require("../blockchain");
const { hashString } = require("../utils/hash");

async function registerVoter(req, res) {
    try {
        const { uniqueVoterId, aadharNumber, state, constituency, boothNumber } = req.body;

        if (!uniqueVoterId || !aadharNumber || !state || !constituency) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields: uniqueVoterId, aadharNumber, state, constituency"
            });
        }

        const voterIdHash = hashString(uniqueVoterId);
        const aadharHash = hashString(aadharNumber);
        const contract = getContract();

        const alreadyRegistered = await contract.isVoterRegistered(voterIdHash);
        if (alreadyRegistered) {
            return res.status(409).json({
                success: false,
                error: "Voter is already registered on the blockchain.",
                voterIdHash
            });
        }

        const tx = await contract.registerVoter(
            voterIdHash,
            aadharHash,
            state,
            constituency,
            boothNumber || ""
        );
        const receipt = await tx.wait();

        return res.status(201).json({
            success: true,
            message: "Voter registered on blockchain.",
            voterIdHash,
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber
        });
    } catch (err) {
        console.error("[registerVoter]", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

module.exports = { registerVoter };