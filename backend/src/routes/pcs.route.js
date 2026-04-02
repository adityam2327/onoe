import express from "express";
import { getPCSByStateCode, getAllPCS } from "../controllers/pcs.controller.js";

const router = express.Router();

router.get("/all", getAllPCS);
router.get("/:state_code", getPCSByStateCode);

export default router;