import express from "express";
import { getStates, getAllStates, createState, updateState, deleteState } from "../controllers/state.conroller.js";

const router = express.Router();

router.get("/", getStates);
router.get("/all", getAllStates);
router.post("/create", createState);
router.put("/:id", updateState);
router.delete("/:id", deleteState);

export default router;