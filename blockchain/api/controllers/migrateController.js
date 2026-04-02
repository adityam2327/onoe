const { getContract } = require("../blockchain");
const { hashString } = require("../utils/hash");

async function migrateVoter(req, res) {
    try {
        const { uniqueVoterId, toState, toConstituency, toBoothNumber } = req.body;

        if (!uniqueVoterId || !toState || !toConstituency) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields: uniqueVoterId, toState, toConstituency"
            });
        }

        const voterIdHash = hashString(uniqueVoterId);
        const contract = getContract();

        const isRegistered = await contract.isVoterRegistered(voterIdHash);
        if (!isRegistered) {
            return res.status(404).json({
                success: false,
                error: "Voter is not registered on the blockchain.",
                voterIdHash
            });
        }

        const tx = await contract.migrateVoter(
            voterIdHash,
            toState,
            toConstituency,
            toBoothNumber || ""
        );
        const receipt = await tx.wait();

        const migrationHistory = await contract.getMigrations(voterIdHash);
        const latest = migrationHistory[migrationHistory.length - 1];

        return res.status(200).json({
            success: true,
            message: "Voter migration logged on blockchain.",
            voterIdHash,
            fromState: latest.fromState,
            toState: latest.toState,
            fromConstituency: latest.fromConstituency,
            toConstituency: latest.toConstituency,
            toBoothNumber: latest.toBoothNumber,
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber
        });
    } catch (err) {
        console.error("[migrateVoter]", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

module.exports = { migrateVoter };