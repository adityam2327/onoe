import express from "express";
import { getECIStats, getCEOStats, getDEOStats } from "../controllers/dashboard.controller.js";
import { authenticateOfficer } from "../middlewares/officerAuth.js";

const router = express.Router();

router.get("/eci-stats", getECIStats);
router.get("/ceo-stats", authenticateOfficer, getCEOStats);
router.get("/deo-stats", authenticateOfficer, getDEOStats);

export default router;
