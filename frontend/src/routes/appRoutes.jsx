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
import { AllPCS } from "../dashboard/AllPCS";
import { AllACS } from "../dashboard/AllACS";
import { AllMobilityBooths } from "../dashboard/AllMobilityBooths";
import { AllStates } from "../dashboard/AllStates";
import { ECIDashboard } from "../dashboard/ECI_HQ/ECIDashboard";
import { ProtectedRoutes } from "../components/gaurds/ProtectedRoutes";
import { CEODashboard } from "../dashboard/CEO/CEODashboard";
import { DEODashboard } from "../dashboard/DEO/DEODashboard";
import { ERODashboard } from "../dashboard/ERO/ERODashboard";
import { BLODashboard } from "../dashboard/BLO/BLODashboard";
import { VerifyVoters } from "../dashboard/VerifyVoters";
import { MobilityVerification } from "../dashboard/MobilityVerification";
import { CreatePollingBoothOfficer } from "../dashboard/CreatePollingBoothOfficer";

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
                path: "verify-voters",
                element: <VerifyVoters />
            },
            {
                path: "mobility-verification",
                element: <MobilityVerification />
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
                path: "create-polling-booth-officer",
                element: <CreatePollingBoothOfficer />
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
                    },
                    {
                        path: "mobility-booths",
                        element: <AllMobilityBooths />
                    },
                    {
                        path: "pcs",
                        element: <AllPCS />
                    },
                    {
                        path: "acs",
                        element: <AllACS />
                    },
                    {
                        path: "states",
                        element: <AllStates />
                    }
                ]
            }
        ]
    }
]);
