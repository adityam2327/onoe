import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "../components/layouts/RootLayout";
import { AuthLayout } from "../components/layouts/AuthLayout";
import { DashboardLayout } from "../components/layouts/DashboardLayout";
import { LandingPage } from "../pages/LandingPage";
import { Login } from "../pages/auth/Login";
import { MyOfficers } from "../dashboard/MyOfficers";
import { CreateOfficer } from "../dashboard/CreateOfficer";
import { AllVoters } from "../dashboard/AllVoters";
import { AllBooths } from "../dashboard/AllBooths";
import { ECIDashboard } from "../dashboard/ECI_HQ/ECIDashboard";
import { ProtectedRoutes } from "../components/gaurds/ProtectedRoutes";
import { CEODashboard } from "../dashboard/CEO/CEODashboard";
import { DEODashboard } from "../dashboard/DEO/DEODashboard";
import { ERODashboard } from "../dashboard/ERO/ERODashboard";
import { BLODashboard } from "../dashboard/BLO/BLODashboard";

export const appRoutes = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <LandingPage />
            }
        ]
    },
    {
        path: "/login",
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <Login />
            }
        ]
    },
    {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard/eci-hq" replace />
            },
            {
                path: "eci-hq",
                element: <ECIDashboard />
            },
            {
                path: "ceo",
                element: <CEODashboard />
            },
            {
                path: "deo",
                element: <DEODashboard />
            },
            {
                path: "ero",
                element: <ERODashboard />
            },
            {
                path: "blo",
                element: <BLODashboard />
            },
            {
                path: "officers",
                element: <MyOfficers />
            },
            {
                path: "create-officer",
                element: <CreateOfficer />
            },
            {
                element: <ProtectedRoutes allowedRoles={["ECI HQ"]} />,
                children: [
                    {
                        path: "voters",
                        element: <AllVoters />
                    },
                    {
                        path: "booths",
                        element: <AllBooths />
                    }
                ]
            }
        ]
    }
]);
