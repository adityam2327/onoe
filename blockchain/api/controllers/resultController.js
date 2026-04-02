const { getContract } = require("../blockchain");
const { hashString } = require("../utils/hash");
async function storeResultHash(req, res) {
  try {
    const { constituencyId, resultData } = req.body;
    if (!constituencyId || !resultData) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: constituencyId, resultData",
      });
    }
    const constituencyIdHash = hashString(constituencyId);
    const resultHash = hashString(resultData);
    const contract = getContract();
    const existing = await contract.electionResults(constituencyIdHash);
    if (existing.isStored) {
      return res.status(409).json({
        success: false,
        error: "Election result already stored for this constituency. Cannot overwrite.",
        constituencyId,
        constituencyIdHash,
        storedResultHash: existing.resultHash,
      });
    }
    const tx = await contract.storeElectionResultHash(constituencyIdHash, resultHash);
    const receipt = await tx.wait();
    return res.status(201).json({
      success: true,
      message: "Election result hash stored on blockchain.",
      constituencyId,
      constituencyIdHash,
      resultHash,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    });
  } catch (err) {
    console.error("[storeResultHash]", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
module.exports = { storeResultHash };