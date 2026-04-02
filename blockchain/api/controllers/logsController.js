const { getContract, getProvider } = require("../blockchain");

async function getLogs(req, res) {
    try {
        const contract = getContract();
        const provider = getProvider();

        const {
            type,
            voterIdHash,
            referenceIdHash,
            fromBlock = 0,
            toBlock = "latest"
        } = req.query;

        const latestBlock = await provider.getBlockNumber();
        const resolvedToBlock = toBlock === "latest" ? latestBlock : Number(toBlock);
        const filterRange = { fromBlock: Number(fromBlock), toBlock: resolvedToBlock };

        const results = [];

        if (!type || type === "registration") {
            const filter = contract.filters.VoterRegistered(voterIdHash || null);
            const events = await contract.queryFilter(filter, filterRange.fromBlock, filterRange.toBlock);
            for (const e of events) {
                results.push({
                    type: "registration",
                    voterIdHash: e.args.voterIdHash,
                    aadharHash: e.args.aadharHash,
                    state: e.args.state,
                    constituency: e.args.constituency,
                    boothNumber: e.args.boothNumber,
                    timestamp: Number(e.args.timestamp),
                    txHash: e.transactionHash,
                    blockNumber: e.blockNumber
                });
            }
        }

        if (!type || type === "verification") {
            const filter = contract.filters.VerificationStepRecorded(referenceIdHash || null);
            const events = await contract.queryFilter(filter, filterRange.fromBlock, filterRange.toBlock);
            for (const e of events) {
                results.push({
                    type: "verification",
                    referenceIdHash: e.args.referenceIdHash,
                    officerRole: e.args.officerRole,
                    approved: e.args.approved,
                    remarks: e.args.remarks,
                    timestamp: Number(e.args.timestamp),
                    txHash: e.transactionHash,
                    blockNumber: e.blockNumber
                });
            }
        }

        if (!type || type === "migration") {
            const filter = contract.filters.VoterMigrated(voterIdHash || null);
            const events = await contract.queryFilter(filter, filterRange.fromBlock, filterRange.toBlock);
            for (const e of events) {
                results.push({
                    type: "migration",
                    voterIdHash: e.args.voterIdHash,
                    fromState: e.args.fromState,
                    toState: e.args.toState,
                    fromConstituency: e.args.fromConstituency,
                    toConstituency: e.args.toConstituency,
                    toBoothNumber: e.args.toBoothNumber,
                    timestamp: Number(e.args.timestamp),
                    txHash: e.transactionHash,
                    blockNumber: e.blockNumber
                });
            }
        }

        if (!type || type === "result") {
            const filter = contract.filters.ElectionResultStored();
            const events = await contract.queryFilter(filter, filterRange.fromBlock, filterRange.toBlock);
            for (const e of events) {
                results.push({
                    type: "electionResult",
                    constituencyId: e.args.constituencyId,
                    resultHash: e.args.resultHash,
                    timestamp: Number(e.args.timestamp),
                    txHash: e.transactionHash,
                    blockNumber: e.blockNumber
                });
            }
        }

        results.sort((a, b) => a.blockNumber - b.blockNumber);

        return res.status(200).json({
            success: true,
            count: results.length,
            latestBlock: resolvedToBlock,
            logs: results
        });
    } catch (err) {
        console.error("[getLogs]", err);
        return res.status(500).json({ success: false, error: err.message });
    }
}

module.exports = { getLogs };