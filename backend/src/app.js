import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Welcome to the Election Management System API");
});

import officerRoutes from "./routes/officer.route.js";
import userRoutes from "./routes/user.route.js";
import stateRoutes from "./routes/state.route.js";
import pcsRoutes from "./routes/pcs.route.js";
import acsRoutes from "./routes/acs.route.js";
import boothsRoutes from "./routes/booths.route.js";
import voterRoutes from "./routes/voter.route.js";
import mobilityBoothsRoutes from "./routes/mobility_booths.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";
import officerDashboardRoutes from "./routes/officerDashboard.route.js";
import pollingBoothOfficerRoutes from "./routes/pollingBoothOfficer.route.js";

app.use("/api/mobility-booths", mobilityBoothsRoutes);
app.use("/api/polling-booth-officers", pollingBoothOfficerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/officers", officerRoutes);
app.use("/api/officer-dashboard", officerDashboardRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/pcs", pcsRoutes);
app.use("/api/acs", acsRoutes);
app.use("/api/booths", boothsRoutes);
app.use("/api/voters", voterRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "An unexpected error occurred" });
});

app.use((_, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
})

export default app;