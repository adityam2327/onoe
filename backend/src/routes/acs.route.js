import express from "express";
import { getACSByPCCode, getAllACS } from "../controllers/acs.controller.js";

const router = express.Router();

router.get("/all", getAllACS);
router.get("/:pc_code", getACSByPCCode);

export default router;