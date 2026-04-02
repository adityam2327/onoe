const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
async function main() {
  console.log("─────────────────────────────────────────────────");
  console.log("  ElectoralSystem — Deployment Script");
  console.log("─────────────────────────────────────────────────");
  const [deployer] = await ethers.getSigners();
  console.log(`\n📦 Deploying with account: ${deployer.address}`);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Account balance: ${ethers.formatEther(balance)} ETH\n`);
  const ElectoralSystem = await ethers.getContractFactory("ElectoralSystem");
  const electoral = await ElectoralSystem.deploy();
  await electoral.waitForDeployment();
  const contractAddress = await electoral.getAddress();
  console.log(`✅ ElectoralSystem deployed at: ${contractAddress}`);
  console.log(`🔑 Admin (deployer): ${deployer.address}`);
  console.log(`⛓️  Network: ${hre.network.name}\n`);
  const deploymentData = {
    contractAddress,
    adminAddress: deployer.address,
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
  };
  const outPath = path.join(__dirname, "../deployment.json");
  fs.writeFileSync(outPath, JSON.stringify(deploymentData, null, 2));
  console.log(`📄 Deployment info saved to: ${outPath}`);
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/ElectoralSystem.sol/ElectoralSystem.json"
  );
  if (fs.existsSync(artifactPath)) {
    const abiDir = path.join(__dirname, "../api/abi");
    if (!fs.existsSync(abiDir)) fs.mkdirSync(abiDir, { recursive: true });
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    fs.writeFileSync(
      path.join(abiDir, "ElectoralSystem.json"),
      JSON.stringify(artifact.abi, null, 2)
    );
    console.log(`📎 ABI copied to: ${abiDir}/ElectoralSystem.json`);
  }
  console.log("\n─────────────────────────────────────────────────");
  console.log("  Deployment complete!");
  console.log("─────────────────────────────────────────────────\n");
}
main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});