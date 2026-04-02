import express from "express";
import { getPCSByStateCode, getAllPCS, createPC, updatePC, deletePC, getAllPCsList } from "../controllers/pcs.controller.js";

const router = express.Router();

router.get("/list", getAllPCsList);
router.get("/all", getAllPCS);
router.get("/by-state/:state_code", getPCSByStateCode);
router.post("/create", createPC);
router.put("/:id", updatePC);
router.delete("/:id", deletePC);

export default router;