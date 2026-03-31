import express from "express";
import { nearestMobilityBooths } from "../controllers/mobility_booths.controller.js";

const router = express.Router();

router.get("/nearest", nearestMobilityBooths);

export default router;