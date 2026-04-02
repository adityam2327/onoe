import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getCurrentOfficer, getMyOfficers } from "@/api/officer.api";
import { Link } from "react-router-dom";
import { Users, UserPlus, RefreshCw } from "lucide-react";

const roleHierarchy = {
    "ECI HQ": "CEO",
    "CEO": "DEO",
    "DEO": "ERO",
    "ERO": "BLO",
    "BLO": null
};

export const MyOfficers = () => {
    const [officer, setOfficer] = useState(null);
    const [myOfficers, setMyOfficers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOfficers = async () => {
        try {
            const officerRes = await getCurrentOfficer();
            setOfficer(officerRes.data);
            
            const officersRes = await getMyOfficers();
            setMyOfficers(officersRes.data);
        } catch (error) {
            console.error("Failed to fetch officers:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOfficers();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#000080] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const childRole = roleHierarchy[officer.role];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#000080]">
                        My {childRole ? `${childRole}s` : 'Officers'}
                    </h2>
                    <p className="text-gray-500">
                        {childRole 
                            ? `Manage ${childRole.toLowerCase()}s under your jurisdiction`
                            : "You don't have any officers under you"
                        }
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        onClick={fetchOfficers}
                        className="border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    {childRole && (
                        <Link to="/dashboard/create-officer">
                            <Button className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white border-0">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Create {childRole}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {!childRole ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Users className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-center">
                            You are at the lowest level of the hierarchy.<br />
                            There are no officers under your supervision.
                        </p>
                    </CardContent>
                </Card>
            ) : myOfficers.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Users className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 text-center mb-4">
                            No {childRole.toLowerCase()}s found.
                        </p>
                        <Link to="/dashboard/create-officer">
                            <Button className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white border-0">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Create Your First {childRole}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-[#000080]">
                            {myOfficers.length} {childRole}{myOfficers.length !== 1 ? 's' : ''} Found
                        </CardTitle>
                        <CardDescription>
                            All {childRole.toLowerCase()}s under your jurisdiction
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {myOfficers.map((officerItem) => (
                                <div 
                                    key={officerItem._id} 
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#FF9933] transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-0.5">
                                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                                <span className="text-[#000080] font-bold">
                                                    {officerItem.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{officerItem.name}</p>
                                            <p className="text-sm text-gray-500">{officerItem.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-[#000080]">{officerItem.role}</p>
                                            <p className="text-xs text-gray-400">
                                                Added {new Date(officerItem.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="w-3 h-3 rounded-full bg-[#138808]"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {childRole && myOfficers.length > 0 && (
                <Card className="bg-gradient-to-r from-[#000080] to-[#FF9933] text-white">
                    <CardContent className="flex items-center justify-between py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold">Need to add more {childRole}s?</p>
                                <p className="text-sm text-white/80">Click below to create a new {childRole.toLowerCase()}</p>
                            </div>
                        </div>
                        <Link to="/dashboard/create-officer">
                            <Button className="bg-white text-[#000080] hover:bg-white/90 border-0">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Create {childRole}
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
