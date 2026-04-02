require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initBlockchain } = require("./blockchain");
const electoralRoutes = require("./routes/electoralRoutes");
const app = express();
const PORT = process.env.API_PORT || 4000;
app.use(cors());
app.use(express.json());
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "ElectoralSystem Blockchain API" });
});
app.use("/", electoralRoutes);
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});
async function start() {
  try {
    await initBlockchain();
    app.listen(PORT, () => {
      console.log(`\n Electoral Blockchain API running on http://localhost:${PORT}`);
      console.log("   Endpoints:");
      console.log("   POST /register        — Register voter (uniqueVoterId + aadharNumber)");
      console.log("   POST /verifyStep      — Log BLO/ERO/DEO/AI verification step");
      console.log("   POST /migrate         — Log voter state/constituency migration");
      console.log("   POST /storeResultHash — Store election result hash");
      console.log("   GET  /logs            — Retrieve all audit logs\n");
    });
  } catch (err) {
    console.error(" Failed to start blockchain API:", err.message);
    process.exit(1);
  }
}
start();