import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getCurrentOfficer } from "@/api/officer.api";
import { User, Users, LogOut, LayoutDashboard, UserCheck, Building2, ShieldCheck, Vote } from "lucide-react";

const roleConfig = {
    "ECI HQ": {
        title: "ECI HQ Dashboard",
        createRole: "CEO",
        color: "#000080"
    },
    "CEO": {
        title: "CEO Dashboard",
        createRole: "DEO",
        color: "#FF9933"
    },
    "DEO": {
        title: "DEO Dashboard",
        createRole: "ERO",
        color: "#138808"
    },
    "ERO": {
        title: "ERO Dashboard",
        createRole: "BLO",
        color: "#FF9933"
    },
    "BLO": {
        title: "BLO Dashboard",
        createRole: null,
        color: "#138808"
    }
};

export const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [officer, setOfficer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOfficer = async () => {
            try {
                const response = await getCurrentOfficer();
                setOfficer(response.data);
            } catch (error) {
                console.error("Failed to fetch officer:", error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchOfficer();
    }, [navigate]);

    const handleLogout = () => {
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#000080] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!officer) {
        return null;
    }

    const config = roleConfig[officer.role] || roleConfig["BLO"];

    return (
        <div className="min-h-screen flex bg-background">
            <aside className="w-64 bg-[#000080] text-white flex flex-col">
                <div className="p-4 border-b border-white/10">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-0.5">
                            <div className="w-full h-full rounded-full bg-[#000080] flex items-center justify-center">
                                <span className="text-white text-xs font-bold">ONOE</span>
                            </div>
                        </div>
                        <span className="text-lg font-bold">ONOE</span>
                    </Link>
                </div>

                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF9933] to-[#138808] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                                {officer.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-sm">{officer.name}</h3>
                            <p className="text-xs text-white/70">{officer.role}</p>
                        </div>
                    </div>
                    <p className="text-xs text-white/60 truncate">{officer.email}</p>
                </div>

                <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                        <li>
                            <Link
                                to={`/dashboard/${officer.role.toLowerCase().replace(" ", "-")}`}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                    location.pathname === `/dashboard/${officer.role.toLowerCase().replace(" ", "-")}`
                                        ? "bg-white/20 text-white"
                                        : "text-white/80 hover:bg-white/10 hover:text-white"
                                }`}
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                Dashboard
                            </Link>
                        </li>
                        {(officer.role === "BLO" || officer.role === "ERO" || officer.role === "DEO") && (
                            <li>
                                <Link
                                    to="/dashboard/verify-voters"
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                        location.pathname === "/dashboard/verify-voters"
                                            ? "bg-white/20 text-white"
                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <ShieldCheck className="w-5 h-5" />
                                    Verify Voters
                                </Link>
                            </li>
                        )}
                        {officer.role === "BLO" && (
                            <li>
                                <Link
                                    to="/dashboard/manage-voters"
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                        location.pathname === "/dashboard/manage-voters"
                                            ? "bg-white/20 text-white"
                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <UserCheck className="w-5 h-5" />
                                    Manage Voters
                                </Link>
                            </li>
                        )}
                        {(officer.role === "ECI HQ" || officer.role === "CEO" || officer.role === "DEO" || officer.role === "ERO") && (
                            <li>
                                <Link
                                    to="/dashboard/officers"
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                        location.pathname === "/dashboard/officers"
                                            ? "bg-white/20 text-white"
                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <Users className="w-5 h-5" />
                                    My Officers
                                </Link>
                            </li>
                        )}
                        {config.createRole && (
                            <li>
                                <Link
                                    to="/dashboard/create-officer"
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                        location.pathname === "/dashboard/create-officer"
                                            ? "bg-white/20 text-white"
                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <User className="w-5 h-5" />
                                    Create {config.createRole}
                                </Link>
                            </li>
                        )}
                        {officer.role === "ECI HQ" && (
                            <li>
                                <Link
                                    to="/dashboard/voters"
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                        location.pathname === "/dashboard/voters"
                                            ? "bg-white/20 text-white"
                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <UserCheck className="w-5 h-5" />
                                    All Voters
                                </Link>
                            </li>
                        )}
                        {officer.role === "CEO" && (
                            <li>
                                <Link
                                    to="/dashboard/voters"
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                        location.pathname === "/dashboard/voters"
                                            ? "bg-white/20 text-white"
                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <UserCheck className="w-5 h-5" />
                                    State Voters
                                </Link>
                            </li>
                        )}
                        {officer.role === "ECI HQ" && (
                            <li>
                                <Link
                                    to="/dashboard/booths"
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                        location.pathname === "/dashboard/booths"
                                            ? "bg-white/20 text-white"
                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <Building2 className="w-5 h-5" />
                                    All Booths
                                </Link>
                            </li>
                        )}
                        {officer.role === "ECI HQ" && (
                            <li>
                                <Link
                                    to="/dashboard/mobility-booths"
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                        location.pathname === "/dashboard/mobility-booths"
                                            ? "bg-white/20 text-white"
                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <Building2 className="w-5 h-5" />
                                    Mobility Booths
                                </Link>
                            </li>
                        )}
                        {officer.role === "ECI HQ" && (
                            <li>
                                <Link
                                    to="/dashboard/pcs"
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                        location.pathname === "/dashboard/pcs"
                                            ? "bg-white/20 text-white"
                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <Building2 className="w-5 h-5" />
                                    Parliamentary Constituencies
                                </Link>
                            </li>
                        )}
                        {officer.role === "ECI HQ" && (
                            <li>
                                <Link
                                    to="/dashboard/acs"
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                        location.pathname === "/dashboard/acs"
                                            ? "bg-white/20 text-white"
                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <Building2 className="w-5 h-5" />
                                    Assembly Constituencies
                                </Link>
                            </li>
                        )}
                        {officer.role === "ECI HQ" && (
                            <li>
                                <Link
                                    to="/dashboard/states"
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                        location.pathname === "/dashboard/states"
                                            ? "bg-white/20 text-white"
                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <Building2 className="w-5 h-5" />
                                    States
                                </Link>
                            </li>
                        )}
                        {officer.role === "ERO" && (
                            <li>
                                <Link
                                    to="/dashboard/create-polling-booth-officer"
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                        location.pathname === "/dashboard/create-polling-booth-officer"
                                            ? "bg-white/20 text-white"
                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <Vote className="w-5 h-5" />
                                    Polling Booth Officers
                                </Link>
                            </li>
                        )}
                        {officer.role === "DEO" && (
                            <li>
                                <Link
                                    to="/dashboard/mobility-verification"
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                        location.pathname === "/dashboard/mobility-verification"
                                            ? "bg-white/20 text-white"
                                            : "text-white/80 hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <ShieldCheck className="w-5 h-5" />
                                    Mobility Verification
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-5 h-1.5 rounded-full bg-[#FF9933]"></div>
                        <div className="w-5 h-1.5 rounded-full bg-white"></div>
                        <div className="w-5 h-1.5 rounded-full bg-[#138808]"></div>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start gap-3 text-white/80 hover:text-white hover:bg-white/10"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </Button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col">
                <header className="bg-white border-b-2 border-[#FF9933] px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-[#000080]">{config.title}</h1>
                            <p className="text-sm text-gray-500">Welcome back, {officer.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#138808]"></div>
                            <span className="text-sm text-gray-600">Online</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-auto">
                    <Outlet />
                </div>

                <footer className="bg-white border-t border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-1.5 rounded-full bg-[#FF9933]"></div>
                            <div className="w-4 h-1.5 rounded-full bg-white border border-gray-200"></div>
                            <div className="w-4 h-1.5 rounded-full bg-[#138808]"></div>
                        </div>

                    </div>
                </footer>
            </main>
        </div>
    );
};
