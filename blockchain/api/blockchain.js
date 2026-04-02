const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
let provider;
let signer;
let contract;
async function initBlockchain() {
  const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";
  const privateKey = process.env.ADMIN_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      "ADMIN_PRIVATE_KEY is not set in .env — cannot sign transactions."
    );
  }
  const deploymentPath = path.join(__dirname, "../../deployment.json");
  if (!fs.existsSync(deploymentPath)) {
    throw new Error(
      `deployment.json not found at ${deploymentPath}. Run 'npm run deploy' first.`
    );
  }
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  const abiPath = path.join(__dirname, "../abi/ElectoralSystem.json");
  if (!fs.existsSync(abiPath)) {
    throw new Error(
      `ABI not found at ${abiPath}. Run 'npm run deploy' to auto-copy it.`
    );
  }
  const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));
  provider = new ethers.JsonRpcProvider(rpcUrl);
  signer = new ethers.Wallet(privateKey, provider);
  contract = new ethers.Contract(deployment.contractAddress, abi, signer);
  console.log(`🔗 Connected to node: ${rpcUrl}`);
  console.log(`📜 Contract: ${deployment.contractAddress}`);
  console.log(`🔑 Signer: ${signer.address}`);
  return { provider, signer, contract };
}
function getContract() {
  if (!contract) throw new Error("Blockchain not initialised. Call initBlockchain() first.");
  return contract;
}
function getProvider() {
  if (!provider) throw new Error("Provider not initialised. Call initBlockchain() first.");
  return provider;
}
module.exports = { initBlockchain, getContract, getProvider };