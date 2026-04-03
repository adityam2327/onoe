import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Building2, MapPin, BarChart3, Settings, RefreshCw, UserCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentOfficer, getECIStats } from "@/api/officer.api";
import { Link } from "react-router-dom";

export const ECIDashboard = () => {
    const [officer, setOfficer] = useState(null);
    const [stats, setStats] = useState({
        voters: 0,
        ceos: 0,
        deos: 0,
        blos: 0,
        states: 0,
        pcs: 0,
        acs: 0,
        booths: 0,
        mobilityBooths: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const officerRes = await getCurrentOfficer();
                setOfficer(officerRes.data);
                
                const statsRes = await getECIStats();
                setStats(statsRes.data);
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
                    <h2 className="text-2xl font-bold text-[#000080]">ECI HQ Dashboard</h2>
                    <p className="text-gray-500">National level electoral management</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#138808]"></div>
                    <span className="text-sm text-gray-600">National HQ Active</span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-[#FF9933]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Voters</CardTitle>
                        <Users className="h-4 w-4 text-[#FF9933]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">{stats.voters.toLocaleString()}</div>
                        <p className="text-xs text-gray-500">Registered voters</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#138808]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total CEOs</CardTitle>
                        <Building2 className="h-4 w-4 text-[#138808]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">{stats.ceos}</div>
                        <p className="text-xs text-gray-500">State Election Officers</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#000080]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total DEOs</CardTitle>
                        <UserCheck className="h-4 w-4 text-[#000080]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">{stats.deos}</div>
                        <p className="text-xs text-gray-500">District Election Officers</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#FF9933]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total BLOs</CardTitle>
                        <Users className="h-4 w-4 text-[#FF9933]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">{stats.blos}</div>
                        <p className="text-xs text-gray-500">Booth Level Officers</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-[#138808]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">States</CardTitle>
                        <MapPin className="h-4 w-4 text-[#138808]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">{stats.states}</div>
                        <p className="text-xs text-gray-500">States & UTs</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#000080]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Parliamentary Constituencies</CardTitle>
                        <Building2 className="h-4 w-4 text-[#000080]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">{stats.pcs}</div>
                        <p className="text-xs text-gray-500">PCs</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#FF9933]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Assembly Constituencies</CardTitle>
                        <Building2 className="h-4 w-4 text-[#FF9933]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">{stats.acs}</div>
                        <p className="text-xs text-gray-500">ACs</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#138808]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Booths</CardTitle>
                        <Building2 className="h-4 w-4 text-[#138808]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">{stats.booths.toLocaleString()}</div>
                        <p className="text-xs text-gray-500">Polling Booths</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-[#000080]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Mobility Booths</CardTitle>
                        <Truck className="h-4 w-4 text-[#000080]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">{stats.mobilityBooths}</div>
                        <p className="text-xs text-gray-500">Mobile Booths</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-[#000080] to-[#FF9933] text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5" />
                            Create CEO
                        </CardTitle>
                        <CardDescription className="text-white/80">
                            Add a new Chief Election Officer for a state
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-white/80 mb-4">
                            Create and assign CEOs to manage state-level electoral operations.
                        </p>
                        <Link to="/dashboard/create-officer">
                            <Button className="bg-white text-[#000080] hover:bg-white/90 border-0">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Create New CEO
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#138808] to-[#000080] text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="w-5 h-5" />
                            All Voters
                        </CardTitle>
                        <CardDescription className="text-white/80">
                            View all registered voters
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-white/80 mb-4">
                            Access the complete list of voters registered across all states.
                        </p>
                        <Link to="/dashboard/voters">
                            <Button className="bg-white text-[#138808] hover:bg-white/90 border-0">
                                <Users className="w-4 h-4 mr-2" />
                                View All Voters
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-[#000080] flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[#FF9933]" />
                            National Overview
                        </CardTitle>
                        <CardDescription>
                            Quick access to national electoral data
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Voter Registration</span>
                            <span className="text-sm font-semibold text-[#138808]">Active</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Booth Management</span>
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
                        You are at the highest level of the electoral hierarchy. Manage state-level officers and oversee national operations.
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
