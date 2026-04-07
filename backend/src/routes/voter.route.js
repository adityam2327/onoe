import express from "express";
import { loginVoter, getAllVoters, checkVoterAndUserViaAadhar, getVotersByBoothId, assignMobilityBooth, verifyMobilityBooth, getMobilityBoothRequests, getVotersByState, markVoterAsDeleted, getDeletedVoters, searchVoters } from "../controllers/voter.controller.js";
import { authenticateOfficer } from "../middlewares/officerAuth.js";

const router = express.Router();

router.post("/login", loginVoter);
router.get("/all", getAllVoters);
router.get("/by-state", getVotersByState);
router.get("/check-aadhar", checkVoterAndUserViaAadhar);
router.get("/by-booth", getVotersByBoothId);
router.get("/search", authenticateOfficer, searchVoters);

router.post("/mobility/assign", assignMobilityBooth);
router.post("/mobility/verify", verifyMobilityBooth);
router.get("/mobility/requests", getMobilityBoothRequests);

router.post("/mark-deleted", authenticateOfficer, markVoterAsDeleted);
router.get("/deleted", authenticateOfficer, getDeletedVoters);

export default router;