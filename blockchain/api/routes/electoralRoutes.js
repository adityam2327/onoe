const express = require("express");
const router = express.Router();

const { registerVoter } = require("../controllers/registerController");
const { migrateVoter } = require("../controllers/migrateController");
const { recordVerificationStep } = require("../controllers/verifyController");
const { storeResultHash } = require("../controllers/resultController");
const { getLogs } = require("../controllers/logsController");

router.post("/register", registerVoter);
router.post("/migrate", migrateVoter);
router.post("/verifyStep", recordVerificationStep);
router.post("/storeResultHash", storeResultHash);
router.get("/logs", getLogs);

module.exports = router;