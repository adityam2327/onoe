import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Building2, MapPin, BarChart3, FileText, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentOfficer, getMyOfficers } from "@/api/officer.api";
import { Link } from "react-router-dom";

export const DEODashboard = () => {
    const [officer, setOfficer] = useState(null);
    const [stats, setStats] = useState({
        eros: 0,
        totalOfficers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const officerRes = await getCurrentOfficer();
                setOfficer(officerRes.data);
                
                const erosRes = await getMyOfficers();
                setStats({
                    eros: erosRes.data.length,
                    totalOfficers: erosRes.data.length
                });
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#000080] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#000080]">DEO Dashboard</h2>
                    <p className="text-gray-500">District level electoral management</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#138808]"></div>
                    <span className="text-sm text-gray-600">District Active</span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-[#FF9933]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total EROs</CardTitle>
                        <Building2 className="h-4 w-4 text-[#FF9933]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">{stats.eros}</div>
                        <p className="text-xs text-gray-500">Electoral Registration Officers</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#138808]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Officers</CardTitle>
                        <Users className="h-4 w-4 text-[#138808]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">{stats.totalOfficers}</div>
                        <p className="text-xs text-gray-500">Assembly level officers</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#000080]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Assemblies</CardTitle>
                        <MapPin className="h-4 w-4 text-[#000080]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">{stats.eros}</div>
                        <p className="text-xs text-gray-500">Assembly constituencies</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#FF9933]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Reports</CardTitle>
                        <FileText className="h-4 w-4 text-[#FF9933]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">0</div>
                        <p className="text-xs text-gray-500">Pending reports</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-[#138808] to-[#000080] text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5" />
                            Create ERO
                        </CardTitle>
                        <CardDescription className="text-white/80">
                            Add a new Electoral Registration Officer
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-white/80 mb-4">
                            Create and assign EROs to manage assembly-level electoral operations.
                        </p>
                        <Link to="/dashboard/create-officer">
                            <Button className="bg-white text-[#138808] hover:bg-white/90 border-0">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Create New ERO
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-[#000080] flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[#FF9933]" />
                            District Overview
                        </CardTitle>
                        <CardDescription>
                            Quick access to district electoral data
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Voter Registration</span>
                            <span className="text-sm font-semibold text-[#138808]">Active</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Assembly Management</span>
                            <span className="text-sm font-semibold text-[#138808]">Active</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Electoral Rolls</span>
                            <span className="text-sm font-semibold text-[#138808]">Active</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-[#000080]">Welcome, {officer.name}</CardTitle>
                    <CardDescription>
                        You are managing district-level electoral operations. Create and oversee assembly-level officers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#FF9933]"></div>
                            <span className="text-sm text-gray-600">Saffron</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-white border border-gray-300"></div>
                            <span className="text-sm text-gray-600">White</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#138808]"></div>
                            <span className="text-sm text-gray-600">Green</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
