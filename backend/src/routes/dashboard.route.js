import express from "express";
import { getECIStats, getCEOStats, getDEOStats, getEROStats, getBLOStats } from "../controllers/dashboard.controller.js";
import { authenticateOfficer } from "../middlewares/officerAuth.js";

const router = express.Router();

router.get("/eci-stats", getECIStats);
router.get("/ceo-stats", authenticateOfficer, getCEOStats);
router.get("/deo-stats", authenticateOfficer, getDEOStats);
router.get("/ero-stats", authenticateOfficer, getEROStats);
router.get("/blo-stats", authenticateOfficer, getBLOStats);

export default router;
