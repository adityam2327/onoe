import express from "express";
import { authenticateOfficer } from "../middlewares/officerAuth.js";
import { getPendingUsers, verifyUser, rejectUser } from "../controllers/officerDashboard.controller.js";

const router = express.Router();

router.get("/pending-users", authenticateOfficer, getPendingUsers);
router.post("/verify", authenticateOfficer, verifyUser);
router.post("/reject", authenticateOfficer, rejectUser);

export default router;
