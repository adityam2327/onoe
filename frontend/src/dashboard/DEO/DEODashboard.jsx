import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Building2, MapPin, BarChart3, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentOfficer, getDEOStats } from "@/api/officer.api";
import { Link } from "react-router-dom";

export const DEODashboard = () => {
    const [officer, setOfficer] = useState(null);
    const [stats, setStats] = useState({
        eros: 0,
        blos: 0,
        assemblies: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const officerRes = await getCurrentOfficer();
                const officerData = officerRes.data;
                setOfficer(officerData);
                
                const statsRes = await getDEOStats();
                const responseData = statsRes.data?.data || statsRes.data || {};
                setStats({
                    eros: responseData.eros || 0,
                    blos: responseData.blos || 0,
                    assemblies: responseData.assemblies || 0
                });
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setStats({
                    eros: 0,
                    blos: 0,
                    assemblies: 0
                });
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
                    <p className="text-gray-500">
                        {officer?.postingAddress?.district || "District"} - {officer?.postingAddress?.state || "State"}
                    </p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="border-[#000080] text-[#000080]"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-l-4 border-l-[#138808]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total EROs</CardTitle>
                        <Building2 className="h-4 w-4 text-[#138808]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">{stats.eros}</div>
                        <p className="text-xs text-gray-500">Electoral Officers</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#000080]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total BLOs</CardTitle>
                        <MapPin className="h-4 w-4 text-[#000080]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">{stats.blos}</div>
                        <p className="text-xs text-gray-500">Booth Level Officers</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#FF9933]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Assemblies</CardTitle>
                        <MapPin className="h-4 w-4 text-[#FF9933]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">{stats.assemblies}</div>
                        <p className="text-xs text-gray-500">Assembly constituencies</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                        <Link to="/dashboard/create-officer">
                            <Button className="bg-white text-[#138808] hover:bg-white/90 border-0 w-full">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Create New ERO
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#FF9933] to-[#000080] text-white col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <Link to="/dashboard/verify-voters">
                                <Button variant="outline" className="w-full border-white text-white hover:bg-white/20 hover:text-white bg-transparent">
                                    Verify Voters
                                </Button>
                            </Link>
                            <Link to="/dashboard/officers">
                                <Button variant="outline" className="w-full border-white text-white hover:bg-white/20 hover:text-white bg-transparent">
                                    Manage Officers
                                </Button>
                            </Link>
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
            </Card>
        </div>
    );
};
