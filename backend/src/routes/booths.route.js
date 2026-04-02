import express from "express";
import { getBoothsByACSCode, getAllBooths, createBooth, updateBooth, deleteBooth } from "../controllers/booths.controller.js";
import { authenticateOfficer } from "../middlewares/officerAuth.js";

const router = express.Router();

router.get("/all", authenticateOfficer, getAllBooths);
router.post("/create", authenticateOfficer, createBooth);
router.put("/:id", authenticateOfficer, updateBooth);
router.delete("/:id", authenticateOfficer, deleteBooth);
router.get("/:acs_code", getBoothsByACSCode);

export default router;