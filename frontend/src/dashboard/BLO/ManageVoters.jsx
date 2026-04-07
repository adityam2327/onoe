import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { searchVoters, markVoterAsDeleted } from "@/api/voter.api";
import { Search, UserX, User, Phone, Calendar, MapPin, AlertTriangle, IdCard } from "lucide-react";
import toast from "react-hot-toast";

export const ManageVoters = () => {
    const [voters, setVoters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState({
        aadharNumber: "",
        uniqueVoterId: "",
        phoneNumber: ""
    });
    const [selectedVoter, setSelectedVoter] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");
    const [actionLoading, setActionLoading] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleChange = (e) => {
        setSearchParams({
            ...searchParams,
            [e.target.name]: e.target.value
        });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        
        const params = {};
        if (searchParams.aadharNumber.trim()) params.aadharNumber = searchParams.aadharNumber.trim();
        if (searchParams.uniqueVoterId.trim()) params.uniqueVoterId = searchParams.uniqueVoterId.trim();
        if (searchParams.phoneNumber.trim()) params.phoneNumber = searchParams.phoneNumber.trim();

        if (Object.keys(params).length === 0) {
            toast.error("Please enter at least one search criteria");
            return;
        }

        setLoading(true);
        setHasSearched(true);
        
        try {
            const response = await searchVoters(params);
            console.log("Search response:", response);
            
            let votersData = [];
            if (Array.isArray(response)) {
                votersData = response;
            } else if (response?.data) {
                votersData = Array.isArray(response.data) ? response.data : [];
            } else if (response?.voters) {
                votersData = Array.isArray(response.voters) ? response.voters : [];
            }
            
            console.log("Voters data:", votersData);
            setVoters(votersData);
        } catch (error) {
            console.error("Search error:", error);
            toast.error(error.message || "Failed to search voters");
            setVoters([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (voter) => {
        setSelectedVoter(voter);
        setDeleteReason("");
        setShowDeleteDialog(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteReason.trim()) {
            toast.error("Please provide a reason for deletion");
            return;
        }

        setActionLoading(selectedVoter._id);
        try {
            await markVoterAsDeleted(selectedVoter._id, deleteReason);
            toast.success("Voter marked as deleted successfully");
            setShowDeleteDialog(false);
            setVoters(voters.filter(v => v._id !== selectedVoter._id));
        } catch (error) {
            toast.error(error.message || "Failed to mark voter as deleted");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#000080]">Manage Voters</h2>
                    <p className="text-gray-500">Search voters and mark as deceased</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-[#000080] flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Search Voters
                    </CardTitle>
                    <CardDescription>Enter any of the following to search</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="aadharNumber">Aadhaar Number</Label>
                                <Input
                                    id="aadharNumber"
                                    name="aadharNumber"
                                    placeholder="Enter 12-digit Aadhaar"
                                    value={searchParams.aadharNumber}
                                    onChange={handleChange}
                                    maxLength={12}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="uniqueVoterId">Voter ID</Label>
                                <Input
                                    id="uniqueVoterId"
                                    name="uniqueVoterId"
                                    placeholder="Enter Voter ID"
                                    value={searchParams.uniqueVoterId}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    placeholder="Enter 10-digit mobile"
                                    value={searchParams.phoneNumber}
                                    onChange={handleChange}
                                    maxLength={10}
                                />
                            </div>
                        </div>
                        <Button 
                            type="submit"
                            className="bg-[#000080] hover:bg-[#000080]/90"
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Search Voter"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-4 border-[#000080] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : !hasSearched ? (
                <Card className="border-2 border-dashed border-gray-300">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Search className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600">Search Voters</h3>
                        <p className="text-sm text-gray-400 mt-2">Enter Aadhaar, Voter ID, or Phone number to search</p>
                    </CardContent>
                </Card>
            ) : voters.length === 0 ? (
                <Card className="border-2 border-dashed border-gray-300">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <User className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600">No Voters Found</h3>
                        <p className="text-sm text-gray-400 mt-2">No voters found matching your search criteria</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {voters.map((voter) => (
                        <div key={voter._id} className="border border-gray-200 rounded-lg p-4 bg-white">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-4">
                                    {voter.imageUrl ? (
                                        <img 
                                            src={voter.imageUrl} 
                                            alt={voter.firstName}
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
                                        <h3 className="text-lg font-bold text-[#000080]">
                                            {voter.firstName} {voter.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-500">Voter ID: {voter.uniqueVoterId}</p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => handleDeleteClick(voter)}
                                    style={{ backgroundColor: "#dc2626" }}
                                    className="hover:bg-red-700 text-white"
                                >
                                    <UserX className="w-4 h-4 mr-2" />
                                    Mark as Deceased
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                                    <p className="text-sm font-medium">{voter.phoneNumber || "N/A"}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Aadhaar</p>
                                    <p className="text-sm font-medium">{voter.aadharNumber || "N/A"}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">DOB</p>
                                    <p className="text-sm font-medium">
                                        {voter.dob ? new Date(voter.dob).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Booth</p>
                                    <p className="text-sm font-medium">{voter.boothNumber}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-[#000080] flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            Mark Voter as Deceased
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <p className="font-semibold text-red-800">
                                {selectedVoter?.firstName} {selectedVoter?.lastName}
                            </p>
                            <p className="text-sm text-red-600">
                                Voter ID: {selectedVoter?.uniqueVoterId}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for deletion *</Label>
                            <Input
                                id="reason"
                                value={deleteReason}
                                onChange={(e) => setDeleteReason(e.target.value)}
                                placeholder="Enter reason (e.g., death certificate verified)"
                                className="border-[#000080]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            style={{ backgroundColor: "#dc2626" }}
                            onClick={handleDeleteConfirm}
                            disabled={!deleteReason.trim() || actionLoading}
                            className="hover:bg-red-700 text-white"
                        >
                            {actionLoading ? "Processing..." : "Confirm Deletion"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
