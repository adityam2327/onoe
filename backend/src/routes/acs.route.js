import express from "express";
import { getACSByPCCode, getAllACS, createAC, updateAC, deleteAC, getAllACsList } from "../controllers/acs.controller.js";

const router = express.Router();

router.get("/list", getAllACsList);
router.get("/all", getAllACS);
router.get("/by-pc/:pc_code", getACSByPCCode);
router.post("/create", createAC);
router.put("/:id", updateAC);
router.delete("/:id", deleteAC);

export default router;