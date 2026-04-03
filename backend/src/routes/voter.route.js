import express from "express";
import { loginVoter, getAllVoters, checkVoterAndUserViaAadhar, getVotersByBoothId } from "../controllers/voter.controller.js";

const router = express.Router();

router.post("/login", loginVoter);
router.get("/all", getAllVoters);
router.get("/check-aadhar", checkVoterAndUserViaAadhar);
router.get("/by-booth", getVotersByBoothId);

export default router;