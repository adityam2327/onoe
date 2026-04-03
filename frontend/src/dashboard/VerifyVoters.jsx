import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getPendingUsers, verifyUser, rejectUser } from "@/api/officerDashboard.api";
import { CheckCircle, XCircle, Eye, UserCheck, AlertCircle, Loader2, MapPin, Phone, Mail, Calendar, IdCard, Heart, Shield } from "lucide-react";

export const VerifyVoters = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [rejectRemarks, setRejectRemarks] = useState("");
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            setLoading(true);
            const response = await getPendingUsers();
            setUsers(response.data);
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

    const handleVerify = async (userId) => {
        try {
            setActionLoading(userId);
            await verifyUser(userId);
            showToast("success", "User verified successfully!");
            fetchPendingUsers();
        } catch (error) {
            showToast("error", error.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectClick = (user) => {
        setSelectedUser(user);
        setRejectRemarks("");
        setShowRejectDialog(true);
    };

    const handleRejectConfirm = async () => {
        if (!rejectRemarks.trim()) {
            showToast("error", "Remarks are required for rejection");
            return;
        }
        try {
            setActionLoading(selectedUser._id);
            await rejectUser(selectedUser._id, rejectRemarks);
            showToast("success", "User rejected successfully!");
            setShowRejectDialog(false);
            fetchPendingUsers();
        } catch (error) {
            showToast("error", error.message);
        } finally {
            setActionLoading(null);
        }
    };

    const getVerificationStatus = (user) => {
        const verification = user.verification || [];
        const blo = verification.find(v => v.level === "BLO");
        const ero = verification.find(v => v.level === "ERO");
        const deo = verification.find(v => v.level === "DEO");
        return { blo, ero, deo };
    };

    const getRoleFromStatus = () => {
        if (users.length > 0) {
            const firstUser = users[0];
            const verification = firstUser.verification || [];
            const blo = verification.find(v => v.level === "BLO");
            const ero = verification.find(v => v.level === "ERO");
            const deo = verification.find(v => v.level === "DEO");

            if (blo?.status === "pending") return "BLO";
            if (ero?.status === "pending") return "ERO";
            if (deo?.status === "pending") return "DEO";
        }
        return "";
    };

    const role = getRoleFromStatus();

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
                    <h2 className="text-2xl font-bold text-[#000080]">Verify Voters</h2>
                    <p className="text-gray-500">
                        {role === "BLO" && "Review and verify users at Booth Level"}
                        {role === "ERO" && "Review BLO-verified users at Electoral Registration level"}
                        {role === "DEO" && "Final verification - Approved users will become voters"}
                    </p>
                </div>
                <Button onClick={fetchPendingUsers} variant="outline" className="border-[#000080] text-[#000080]">
                    Refresh
                </Button>
            </div>

            <div className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] p-1 rounded-lg">
                <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Verification Progress</span>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#138808] flex items-center justify-center text-white text-xs font-bold">1</div>
                                <span className="text-xs text-gray-600">BLO</span>
                            </div>
                            <div className="w-8 h-0.5 bg-[#138808]"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center text-white text-xs font-bold">2</div>
                                <span className="text-xs text-gray-600">ERO</span>
                            </div>
                            <div className="w-8 h-0.5 bg-[#FF9933]"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#000080] flex items-center justify-center text-white text-xs font-bold">3</div>
                                <span className="text-xs text-gray-600">DEO</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-[#000080]" />
                </div>
            ) : users.length === 0 ? (
                <Card className="border-2 border-dashed border-gray-300">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <UserCheck className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600">No Pending Users</h3>
                        <p className="text-sm text-gray-400 mt-2">
                            {role === "BLO" && "No users waiting for BLO verification"}
                            {role === "ERO" && "No users verified by BLO yet"}
                            {role === "DEO" && "No users verified by BLO and ERO yet"}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {users.map((user) => {
                        const { blo, ero, deo } = getVerificationStatus(user);
                        return (
                            <Card key={user._id} className="border-l-4 border-l-[#000080]">
                                <CardHeader className="flex flex-row items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        {user.imageUrl ? (
                                            <img 
                                                src={user.imageUrl} 
                                                alt={`${user.firstName} ${user.lastName}`}
                                                className="w-14 h-14 rounded-full object-cover border-2 border-[#FF9933]"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF9933] to-[#138808] flex items-center justify-center">
                                                <span className="text-white font-bold text-xl">
                                                    {user.firstName?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <CardTitle className="text-[#000080] text-lg">
                                                {user.firstName} {user.lastName}
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-3 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <IdCard className="w-3 h-3" />
                                                    {user.aadharNumber}
                                                </span>
                                                <span>•</span>
                                                <span className="capitalize">{user.gender}</span>
                                                {user.dob && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(user.dob).toLocaleDateString()}
                                                        </span>
                                                    </>
                                                )}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleVerify(user._id)}
                                            disabled={actionLoading === user._id}
                                            className="bg-[#138808] hover:bg-[#138808]/90 text-white"
                                        >
                                            {actionLoading === user._id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Verify
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={() => handleRejectClick(user)}
                                            disabled={actionLoading === user._id}
                                            variant="destructive"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Reject
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setSelectedUser(user)}
                                            className="border-[#000080] text-[#000080]"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                                <Phone className="w-3 h-3" /> Phone
                                            </p>
                                            <p className="text-sm font-medium">{user.phoneNumber || "N/A"}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                                <Mail className="w-3 h-3" /> Email
                                            </p>
                                            <p className="text-sm font-medium truncate">{user.email || "N/A"}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> Booth
                                            </p>
                                            <p className="text-sm font-medium">{user.boothNumber || "N/A"}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> Assembly
                                            </p>
                                            <p className="text-sm font-medium">{user.assembley || "N/A"}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <p className="text-xs text-gray-500 mb-3">Verification Status</p>
                                        <div className="flex flex-wrap gap-3">
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                                                blo?.status === "verified" ? "bg-[#138808]/10 text-[#138808] border border-[#138808]" :
                                                blo?.status === "rejected" ? "bg-red-100 text-red-600 border border-red-600" :
                                                blo?.status === "pending" && role === "BLO" ? "bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]" :
                                                "bg-gray-100 text-gray-400 border border-gray-300"
                                            }`}>
                                                <span className={`w-2.5 h-2.5 rounded-full ${
                                                    blo?.status === "verified" ? "bg-[#138808]" :
                                                    blo?.status === "rejected" ? "bg-red-600" :
                                                    "bg-gray-400"
                                                }`}></span>
                                                <Shield className="w-4 h-4" />
                                                <span className="text-sm font-semibold">BLO: {blo?.status || "pending"}</span>
                                            </div>
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                                                ero?.status === "verified" ? "bg-[#138808]/10 text-[#138808] border border-[#138808]" :
                                                ero?.status === "rejected" ? "bg-red-100 text-red-600 border border-red-600" :
                                                ero?.status === "pending" && role === "ERO" ? "bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]" :
                                                "bg-gray-100 text-gray-400 border border-gray-300"
                                            }`}>
                                                <span className={`w-2.5 h-2.5 rounded-full ${
                                                    ero?.status === "verified" ? "bg-[#138808]" :
                                                    ero?.status === "rejected" ? "bg-red-600" :
                                                    "bg-gray-400"
                                                }`}></span>
                                                <Shield className="w-4 h-4" />
                                                <span className="text-sm font-semibold">ERO: {ero?.status || "pending"}</span>
                                            </div>
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                                                deo?.status === "verified" ? "bg-[#138808]/10 text-[#138808] border border-[#138808]" :
                                                deo?.status === "rejected" ? "bg-red-100 text-red-600 border border-red-600" :
                                                deo?.status === "pending" && role === "DEO" ? "bg-[#FF9933]/10 text-[#FF9933] border border-[#FF9933]" :
                                                "bg-gray-100 text-gray-400 border border-gray-300"
                                            }`}>
                                                <span className={`w-2.5 h-2.5 rounded-full ${
                                                    deo?.status === "verified" ? "bg-[#138808]" :
                                                    deo?.status === "rejected" ? "bg-red-600" :
                                                    "bg-gray-400"
                                                }`}></span>
                                                <Shield className="w-4 h-4" />
                                                <span className="text-sm font-semibold">DEO: {deo?.status || "pending"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <Dialog open={showRejectDialog} onClose={() => setShowRejectDialog(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-[#000080]">Reject User</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting {selectedUser?.firstName} {selectedUser?.lastName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="remarks">Rejection Remarks *</Label>
                            <Input
                                id="remarks"
                                value={rejectRemarks}
                                onChange={(e) => setRejectRemarks(e.target.value)}
                                placeholder="Enter reason for rejection..."
                                className="border-[#000080]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRejectConfirm}
                            disabled={!rejectRemarks.trim() || actionLoading}
                        >
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Rejection"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!selectedUser && !showRejectDialog} onClose={() => setSelectedUser(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-[#000080] flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            Complete User Details
                        </DialogTitle>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-6">
                            <div className="flex items-start gap-6">
                                {selectedUser.imageUrl ? (
                                    <img 
                                        src={selectedUser.imageUrl} 
                                        alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                                        className="w-32 h-32 rounded-xl object-cover border-2 border-[#FF9933]"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-[#FF9933] to-[#138808] flex items-center justify-center">
                                        <span className="text-white font-bold text-4xl">
                                            {selectedUser.firstName?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-[#000080]">
                                        {selectedUser.firstName} {selectedUser.lastName}
                                    </h3>
                                    <p className="text-gray-500 mt-1">Reference ID: {selectedUser.referenceId}</p>
                                    <div className="flex gap-4 mt-3">
                                        <span className="px-3 py-1 bg-[#FF9933]/10 text-[#FF9933] rounded-full text-sm capitalize">
                                            {selectedUser.gender}
                                        </span>
                                        {selectedUser.dob && (
                                            <span className="px-3 py-1 bg-[#138808]/10 text-[#138808] rounded-full text-sm">
                                                {new Date(selectedUser.dob).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                        <IdCard className="w-3 h-3" /> Aadhaar Number
                                    </p>
                                    <p className="font-semibold">{selectedUser.aadharNumber}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                        <Phone className="w-3 h-3" /> Phone Number
                                    </p>
                                    <p className="font-semibold">{selectedUser.phoneNumber || "N/A"}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> Email Address
                                    </p>
                                    <p className="font-semibold">{selectedUser.email || "N/A"}</p>
                                </div>
                            </div>

                            {selectedUser.address && (
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-sm font-semibold text-[#000080] mb-3 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> Address Details
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">House Number</p>
                                            <p className="font-medium">{selectedUser.address.houseNumber || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Village</p>
                                            <p className="font-medium">{selectedUser.address.village || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Tehsil</p>
                                            <p className="font-medium">{selectedUser.address.tehsil || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Post Office</p>
                                            <p className="font-medium">{selectedUser.address.postOffice || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Police Station</p>
                                            <p className="font-medium">{selectedUser.address.policeStation || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">District</p>
                                            <p className="font-medium">{selectedUser.address.district || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">State</p>
                                            <p className="font-medium">{selectedUser.address.state || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Pincode</p>
                                            <p className="font-medium">{selectedUser.address.pincode || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                {selectedUser.relative && (
                                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <p className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
                                            <Heart className="w-4 h-4" /> Relative Information
                                        </p>
                                        <p className="text-sm">
                                            <span className="text-gray-500">Relation:</span> 
                                            <span className="font-medium ml-2 capitalize">{selectedUser.relative.type}</span>
                                        </p>
                                        <p className="text-sm mt-1">
                                            <span className="text-gray-500">Name:</span> 
                                            <span className="font-medium ml-2">{selectedUser.relative.name}</span>
                                        </p>
                                    </div>
                                )}

                                {selectedUser.disability && selectedUser.disability.type !== "none" && (
                                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                                        <p className="text-sm font-semibold text-orange-700 mb-2">Disability Information</p>
                                        <p className="text-sm">
                                            <span className="text-gray-500">Type:</span> 
                                            <span className="font-medium ml-2 capitalize">{selectedUser.disability.type}</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Booth Number</p>
                                    <p className="font-semibold">{selectedUser.boothNumber || "N/A"}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Assembly</p>
                                    <p className="font-semibold">{selectedUser.assembley || "N/A"}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Consituency</p>
                                    <p className="font-semibold">{selectedUser.consituency || "N/A"}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">District</p>
                                    <p className="font-semibold">{selectedUser.district || "N/A"}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-[#FF9933]/10 via-[#000080]/10 to-[#138808]/10 rounded-lg border">
                                <p className="text-sm font-semibold text-[#000080] mb-4 flex items-center gap-2">
                                    <Shield className="w-4 h-4" /> Verification Status
                                </p>
                                <div className="space-y-3">
                                    {selectedUser.verification?.map((v) => (
                                        <div key={v.level} className={`p-3 rounded-lg ${
                                            v.status === "verified" ? "bg-[#138808]/10 border border-[#138808]" :
                                            v.status === "rejected" ? "bg-red-100 border border-red-600" :
                                            "bg-gray-100 border border-gray-300"
                                        }`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Shield className={`w-4 h-4 ${
                                                        v.status === "verified" ? "text-[#138808]" :
                                                        v.status === "rejected" ? "text-red-600" :
                                                        "text-gray-400"
                                                    }`} />
                                                    <span className="font-semibold">{v.level}</span>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    v.status === "verified" ? "bg-[#138808] text-white" :
                                                    v.status === "rejected" ? "bg-red-600 text-white" :
                                                    "bg-gray-400 text-white"
                                                }`}>
                                                    {v.status}
                                                </span>
                                            </div>
                                            {v.remarks && (
                                                <p className="text-xs text-gray-500 mt-2">
                                                    <span className="font-medium">Remarks:</span> {v.remarks}
                                                </p>
                                            )}
                                            {v.verifiedAt && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(v.verifiedAt).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    onClick={() => {
                                        handleVerify(selectedUser._id);
                                        setSelectedUser(null);
                                    }}
                                    disabled={actionLoading === selectedUser._id}
                                    className="flex-1 bg-[#138808] hover:bg-[#138808]/90 text-white"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Verify & Proceed
                                </Button>
                                <Button
                                    onClick={() => handleRejectClick(selectedUser)}
                                    disabled={actionLoading === selectedUser._id}
                                    variant="destructive"
                                    className="flex-1"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
