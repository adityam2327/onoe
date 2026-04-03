import express from "express";
import { 
    createPollingBoothOfficer, 
    loginPollingBoothOfficer, 
    getMyPollingBoothOfficers,
    getBoothsForAssignment,
    getMobilityBoothsForAssignment,
    assignBoothToOfficer,
    assignMobilityBoothToOfficer
} from "../controllers/pollingBoothOfficer.controller.js";
import { authenticateOfficer } from "../middlewares/officerAuth.js";

const router = express.Router();

router.post("/login", loginPollingBoothOfficer);
router.post("/create", authenticateOfficer, createPollingBoothOfficer);
router.get("/my-polling-booth-officers", authenticateOfficer, getMyPollingBoothOfficers);
router.get("/booths", authenticateOfficer, getBoothsForAssignment);
router.get("/mobility-booths", authenticateOfficer, getMobilityBoothsForAssignment);
router.post("/assign-booth", authenticateOfficer, assignBoothToOfficer);
router.post("/assign-mobility-booth", authenticateOfficer, assignMobilityBoothToOfficer);

export default router;
