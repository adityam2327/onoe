import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, MapPin, BarChart3, FileText, Vote, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentOfficer } from "@/api/officer.api";

export const BLODashboard = () => {
    const [officer, setOfficer] = useState(null);
    const [stats, setStats] = useState({
        voters: 0,
        booths: 1
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const officerRes = await getCurrentOfficer();
                setOfficer(officerRes.data);
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
                    <h2 className="text-2xl font-bold text-[#000080]">BLO Dashboard</h2>
                    <p className="text-gray-500">Booth Level Officer</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#138808]"></div>
                    <span className="text-sm text-gray-600">Booth Active</span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-[#FF9933]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">My Voters</CardTitle>
                        <Users className="h-4 w-4 text-[#FF9933]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">{stats.voters}</div>
                        <p className="text-xs text-gray-500">Registered voters</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#138808]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">My Booth</CardTitle>
                        <Vote className="h-4 w-4 text-[#138808]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#000080]">{stats.booths}</div>
                        <p className="text-xs text-gray-500">Polling station</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-[#000080]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Status</CardTitle>
                        <CheckCircle className="h-4 w-4 text-[#000080]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#138808]">Active</div>
                        <p className="text-xs text-gray-500">Operational</p>
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
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[#000080] flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-[#138808]" />
                            Your Responsibilities
                        </CardTitle>
                        <CardDescription>
                            Core duties as a Booth Level Officer
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-[#138808]"></div>
                            <span className="text-sm text-gray-600">Voter registration and verification</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-[#138808]"></div>
                            <span className="text-sm text-gray-600">Electoral roll maintenance</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-[#138808]"></div>
                            <span className="text-sm text-gray-600">Polling station management</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-[#138808]"></div>
                            <span className="text-sm text-gray-600">Voter awareness and outreach</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-[#000080] flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[#FF9933]" />
                            Booth Overview
                        </CardTitle>
                        <CardDescription>
                            Quick access to booth data
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

            <Card className="bg-gradient-to-r from-[#138808] to-[#FF9933] text-white">
                <CardHeader>
                    <CardTitle>Welcome, {officer.name}</CardTitle>
                    <CardDescription className="text-white/80">
                        You are at the grassroots level of the electoral system. Your role is crucial for voter registration and polling station operations.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-white"></div>
                            <span className="text-sm text-white/80">Grassroots Level</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#138808]"></div>
                            <span className="text-sm text-white/80">Active</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
