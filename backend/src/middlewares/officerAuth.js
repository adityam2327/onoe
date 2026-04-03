import { Officer } from "../models/officer.model.js";
import jwt from "jsonwebtoken";

export const authenticateOfficer = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const officer = await Officer.findById(decode._id);

        if (!officer) {
            return res.status(401).json({ error: "Unauthorized: Officer not found" });
        }

        req.officer = officer;

        next();
    } catch (error) {
        console.error("Error authenticating officer:", error);
        res.status(400).json({ error: error.message });
    }
}