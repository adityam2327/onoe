import express from "express";
import { getECIStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/eci-stats", getECIStats);

export default router;
