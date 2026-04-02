import express from "express";
import { nearestMobilityBooths, getAllMobilityBooths, createMobilityBooth, updateMobilityBooth, deleteMobilityBooth } from "../controllers/mobility_booths.controller.js";

const router = express.Router();

router.get("/nearest", nearestMobilityBooths);
router.get("/all", getAllMobilityBooths);
router.post("/create", createMobilityBooth);
router.put("/:id", updateMobilityBooth);
router.delete("/:id", deleteMobilityBooth);

export default router;