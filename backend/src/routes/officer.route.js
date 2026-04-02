import express from "express";
import { createOfficer, loginOfficer, getOfficersByRole, getMyOfficers, getCurrentOfficer } from "../controllers/officer.controller.js";
import { authenticateOfficer } from "../middlewares/officerAuth.js";

const router = express.Router();

router.post("/login", loginOfficer);
router.post("/create", authenticateOfficer, createOfficer);
router.get("/me", authenticateOfficer, getCurrentOfficer);
router.get("/my-officers", authenticateOfficer, getMyOfficers);
router.get("/role/:role", authenticateOfficer, getOfficersByRole);

export default router;
