import express from "express";
import { createUser, getUsers, getUserById } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/create", upload.single("avatar"), createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);

export default router;