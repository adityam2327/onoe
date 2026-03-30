import express from "express";
import { loginVoter } from "../controllers/voter.controller.js";

const router = express.Router();

router.post("/login", loginVoter);

export default router;