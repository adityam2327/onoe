import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye, AlertCircle, Loader2, MapPin, Phone, Mail, Calendar, IdCard, UserCheck } from "lucide-react";
import { getMobilityRequests, verifyMobilityBooth } from "@/api/voter.api";

export const MobilityVerification = () => {
    const [voters, setVoters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchMobilityRequests();
    }, []);

    const fetchMobilityRequests = async () => {
        try {
            setLoading(true);
            const response = await getMobilityRequests();
            setVoters(response.data);
        } catch (error) {
            showToast("error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const handleVerify = async (voterId) => {
        try {
            setActionLoading(voterId);
            await verifyMobilityBooth(voterId, true);
            showToast("success", "Voter verified successfully!");
            fetchMobilityRequests();
        } catch (error) {
            showToast("error", error.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (voterId) => {
        try {
            setActionLoading(voterId);
            await verifyMobilityBooth(voterId, false);
            showToast("success", "Voter rejected successfully!");
            fetchMobilityRequests();
        } catch (error) {
            showToast("error", error.message);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-6">
            {toast && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
                    toast.type === "success" ? "bg-[#138808] text-white" : "bg-red-500 text-white"
                }`}>
                    {toast.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span>{toast.message}</span>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#000080]">Mobility Verification</h2>
                    <p className="text-gray-500">
                        Verify voters who have requested mobility booth assignments
                    </p>
                </div>
                <Button onClick={fetchMobilityRequests} variant="outline" className="border-[#000080] text-[#000080]">
                    Refresh
                </Button>
            </div>

            <div className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] p-1 rounded-lg">
                <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Verification Status</span>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center text-white text-xs font-bold">
                                    {voters.length}
                                </div>
                                <span className="text-xs text-gray-600">Pending</span>
                            </div>
                            <div className="w-8 h-0.5 bg-[#138808]"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#138808] flex items-center justify-center text-white text-xs font-bold">✓</div>
                                <span className="text-xs text-gray-600">Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#000080]" />
                </div>
            ) : voters.length === 0 ? (
                <Card className="border-2 border-dashed border-gray-300">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <UserCheck className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600">No Pending Requests</h3>
                        <p className="text-sm text-gray-400 mt-2">
                            No voters waiting for mobility booth verification
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {voters.map((voter) => (
                        <Card key={voter._id} className="border-l-4 border-l-[#FF9933]">
                            <CardHeader className="flex flex-row items-start justify-between">
                                <div className="flex items-center gap-4">
                                    {voter.imageUrl ? (
                                        <img 
                                            src={voter.imageUrl} 
                                            alt={`${voter.firstName} ${voter.lastName}`}
                                            className="w-14 h-14 rounded-full object-cover border-2 border-[#FF9933]"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF9933] to-[#138808] flex items-center justify-center">
                                            <span className="text-white font-bold text-xl">
                                                {voter.firstName?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <CardTitle className="text-[#000080] text-lg">
                                            {voter.firstName} {voter.lastName}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-3 mt-1">
                                            <span className="flex items-center gap-1">
                                                <IdCard className="w-3 h-3" />
                                                {voter.aadharNumber}
                                            </span>
                                            <span>•</span>
                                            <span className="capitalize">{voter.gender}</span>
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleVerify(voter._id)}
                                        disabled={actionLoading === voter._id}
                                        className="bg-[#138808] hover:bg-[#138808]/90 text-white"
                                    >
                                        {actionLoading === voter._id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Verify
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => handleReject(voter._id)}
                                        disabled={actionLoading === voter._id}
                                        variant="destructive"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setSelectedVoter(voter)}
                                        className="border-[#000080] text-[#000080]"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                            <Phone className="w-3 h-3" /> Phone
                                        </p>
                                        <p className="text-sm font-medium">{voter.phoneNumber || "N/A"}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                            <Mail className="w-3 h-3" /> Email
                                        </p>
                                        <p className="text-sm font-medium truncate">{voter.email || "N/A"}</p>
                                    </div>
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> Assigned Booth
                                        </p>
                                        <p className="text-sm font-medium text-[#000080]">{voter.mobilityBoothId || "N/A"}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs text-gray-500 mb-1">Original Booth
                                        </p>
                                        <p className="text-sm font-medium">{voter.boothNumber || "N/A"}</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                                        voter.isVerifiedMobilityBoothId 
                                            ? "bg-[#138808]/10 text-[#138808] border border-[#138808]" 
                                            : "bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]"
                                    }`}>
                                        <span className={`w-2.5 h-2.5 rounded-full ${
                                            voter.isVerifiedMobilityBoothId ? "bg-[#138808]" : "bg-[#FF9933]"
                                        }`}></span>
                                        <span className="text-sm font-semibold">
                                            Status: {voter.isVerifiedMobilityBoothId ? "Verified" : "Pending Verification"}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {selectedVoter && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedVoter(null)}>
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start gap-6">
                            {selectedVoter.imageUrl ? (
                                <img 
                                    src={selectedVoter.imageUrl} 
                                    alt={`${selectedVoter.firstName} ${selectedVoter.lastName}`}
                                    className="w-24 h-24 rounded-xl object-cover border-2 border-[#FF9933]"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#FF9933] to-[#138808] flex items-center justify-center">
                                    <span className="text-white font-bold text-3xl">
                                        {selectedVoter.firstName?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-[#000080]">
                                    {selectedVoter.firstName} {selectedVoter.lastName}
                                </h3>
                                <p className="text-gray-500 mt-1">Unique Voter ID: {selectedVoter.uniqueVoterId}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Aadhaar Number</p>
                                <p className="font-semibold">{selectedVoter.aadharNumber}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                                <p className="font-semibold">{selectedVoter.phoneNumber || "N/A"}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Gender</p>
                                <p className="font-semibold capitalize">{selectedVoter.gender}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                                <p className="font-semibold">{selectedVoter.dob ? new Date(selectedVoter.dob).toLocaleDateString() : "N/A"}</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 col-span-2">
                                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> Requested Mobility Booth
                                </p>
                                <p className="font-semibold text-[#000080] text-lg">{selectedVoter.mobilityBoothId}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Original Booth</p>
                                <p className="font-semibold">{selectedVoter.boothNumber}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Assembly</p>
                                <p className="font-semibold">{selectedVoter.assembley}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6 pt-4 border-t">
                            <Button
                                onClick={() => {
                                    handleVerify(selectedVoter._id);
                                    setSelectedVoter(null);
                                }}
                                disabled={actionLoading === selectedVoter._id}
                                className="flex-1 bg-[#138808] hover:bg-[#138808]/90 text-white"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Verify
                            </Button>
                            <Button
                                onClick={() => {
                                    handleReject(selectedVoter._id);
                                    setSelectedVoter(null);
                                }}
                                disabled={actionLoading === selectedVoter._id}
                                variant="destructive"
                                className="flex-1"
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setSelectedVoter(null)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};