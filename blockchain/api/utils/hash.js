const crypto = require("crypto");
function hashVoterId(voterId) {
  if (!voterId || typeof voterId !== "string") {
    throw new Error("hashVoterId: voterId must be a non-empty string");
  }
  const hash = crypto.createHash("sha256").update(voterId.trim()).digest("hex");
  return "0x" + hash;
}
function hashString(input) {
  if (!input || typeof input !== "string") {
    throw new Error("hashString: input must be a non-empty string");
  }
  return "0x" + crypto.createHash("sha256").update(input.trim()).digest("hex");
}
module.exports = { hashVoterId, hashString };