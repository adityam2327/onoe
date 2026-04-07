import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, MapPin, RefreshCw, CheckCircle, FileText, AlertCircle, IdCard, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentOfficer } from "@/api/officer.api";
import { Link } from "react-router-dom";

export const BLODashboard = () => {
    const [officer, setOfficer] = useState(null);
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
                    <p className="text-gray-500">
                        Booth {officer?.postingAddress?.boothNumber || ""} - {officer?.postingAddress?.assembley || ""}
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

            <Card className="border-l-4 border-l-[#138808]">
                <CardHeader>
                    <CardTitle className="text-[#000080] flex items-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        Voter Verification Guidelines
                    </CardTitle>
                    <CardDescription>
                        Follow these government guidelines when physically verifying a voter application
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <h4 className="font-semibold text-[#000080] flex items-center gap-2">
                            <IdCard className="w-4 h-4" />
                            Step 1: Document Verification
                        </h4>
                        <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
                            <li>Verify the applicant's photograph matches the person present</li>
                            <li>Check the Aadhaar card/ID proof for authenticity</li>
                            <li>Confirm the address proof matches the declared residence</li>
                            <li>Verify date of birth from original documents (Birth certificate, SSLC book, etc.)</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-[#000080] flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Step 2: Address Verification
                        </h4>
                        <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
                            <li>Visit the declared residence for verification</li>
                            <li>Confirm the applicant actually resides at the given address</li>
                            <li>Check if the housing number/landmark matches</li>
                            <li>Verify with neighbors if necessary</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-[#000080] flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Step 3: Personal Verification
                        </h4>
                        <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
                            <li>Ask personal questions to verify identity (family details, local landmarks)</li>
                            <li>Cross-check with electoral roll of the area</li>
                            <li>Ensure the applicant is not already registered in another constituency</li>
                            <li>Verify eligibility criteria (age 18+, citizen of India, etc.)</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-semibold text-[#000080] flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Important Points to Remember
                        </h4>
                        <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
                            <li>Maintain strict confidentiality of voter information</li>
                            <li>Report any suspicious activities to higher authorities immediately</li>
                            <li>Keep records of all verifications performed</li>
                            <li>Follow the Model Code of Conduct during election periods</li>
                            <li>Be impartial and verify all applicants equally</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-[#FF9933] to-[#138808] text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Verify Voters
                        </CardTitle>
                        <CardDescription className="text-white/80">
                            Review and verify voter applications
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link to="/dashboard/verify-voters">
                            <Button className="bg-white text-[#FF9933] hover:bg-white/90 border-0 w-full">
                                Open Verification
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#138808] to-[#000080] text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            Booth Location
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="text-sm">
                            <span className="font-semibold">Booth:</span> {officer?.postingAddress?.boothNumber || "N/A"}
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold">Assembly:</span> {officer?.postingAddress?.assembley || "N/A"}
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold">District:</span> {officer?.postingAddress?.district || "N/A"}
                        </p>
                        <p className="text-sm">
                            <span className="font-semibold">State:</span> {officer?.postingAddress?.state || "N/A"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-[#000080]">Welcome, {officer.name}</CardTitle>
                    <CardDescription>
                        You are at the grassroots level of the electoral system. Your role is crucial for voter registration and polling station operations.
                    </CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
};
