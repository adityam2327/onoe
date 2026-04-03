import express from "express";
import { authenticateOfficer } from "../middlewares/officerAuth.js";
import { getPendingUsers, verifyUser, rejectUser, convertToVoter, convertAllVerifiedToVoters } from "../controllers/officerDashboard.controller.js";

const router = express.Router();

router.get("/pending-users", authenticateOfficer, getPendingUsers);
router.post("/verify", authenticateOfficer, verifyUser);
router.post("/reject", authenticateOfficer, rejectUser);
router.post("/convert-to-voter", authenticateOfficer, convertToVoter);
router.post("/convert-all-to-voters", authenticateOfficer, convertAllVerifiedToVoters);

export default router;
