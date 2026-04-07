import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { getAllVoters, getVotersByState } from "@/api/voter.api";
import { getCurrentOfficer } from "@/api/officer.api";
import { Users, Search, RefreshCw, ChevronLeft, ChevronRight, User, X, Phone, Mail, MapPin, Calendar, Building, Hash, IdCard } from "lucide-react";

export const AllVoters = () => {
    const [voters, setVoters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [officer, setOfficer] = useState(null);
    const [stats, setStats] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [filters, setFilters] = useState({
        state: "",
        district: "",
        assembly: "",
        gender: ""
    });
    const [selectedVoter, setSelectedVoter] = useState(null);

    const fetchVoters = async (page = 1) => {
        setLoading(true);
        try {
            let response;
            if (officer?.role === "CEO") {
                const state = officer.postingAddress?.state;
                if (state) {
                    response = await getVotersByState(state, page, pagination.limit);
                    const responseData = response.data?.data || response.data || {};
                    setStats(responseData.stats);
                    setVoters(responseData.voters || []);
                    setPagination(responseData.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
                    setLoading(false);
                    return;
                }
            } else {
                const params = { page, limit: pagination.limit, ...filters };
                Object.keys(params).forEach(key => !params[key] && delete params[key]);
                response = await getAllVoters(params);
            }
            const responseData = response.data?.data || response.data || {};
            setVoters(responseData.voters || []);
            setPagination(responseData.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 });
        } catch (error) {
            console.error("Failed to fetch voters:", error);
            setVoters([]);
            setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const officerRes = await getCurrentOfficer();
                setOfficer(officerRes.data);
            } catch (error) {
                console.error("Failed to fetch officer:", error);
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (officer) {
            fetchVoters();
        }
    }, [officer]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchVoters(newPage);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearch = () => {
        fetchVoters(1);
    };

    const handleClearFilters = () => {
        setFilters({ state: "", district: "", assembly: "", gender: "" });
        fetchVoters(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#000080]">
                        {officer?.role === "CEO" ? "State Voters" : "All Voters"}
                    </h2>
                    <p className="text-gray-500">
                        {officer?.role === "CEO" 
                            ? `Voters of ${officer.postingAddress?.state}`
                            : "View and manage registered voters"
                        }
                    </p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={() => fetchVoters(pagination.page)}
                    className="border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {stats && officer?.role === "CEO" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-l-4 border-l-[#FF9933]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Voters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#000080]">{stats.totalVoters?.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-[#138808]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Districts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#000080]">{stats.totalDistricts}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-[#000080]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Assemblies</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#000080]">{stats.totalAssemblies}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {officer?.role !== "CEO" && (
            <Card>
                <CardHeader>
                    <CardTitle className="text-[#000080] flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Filter Voters
                    </CardTitle>
                    <CardDescription>Search voters by location and demographics</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input 
                                id="state" 
                                placeholder="State"
                                value={filters.state}
                                onChange={(e) => handleFilterChange("state", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="district">District</Label>
                            <Input 
                                id="district" 
                                placeholder="District"
                                value={filters.district}
                                onChange={(e) => handleFilterChange("district", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="assembly">Assembly</Label>
                            <Input 
                                id="assembly" 
                                placeholder="Assembly"
                                value={filters.assembly}
                                onChange={(e) => handleFilterChange("assembly", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select 
                                id="gender"
                                value={filters.gender} 
                                onChange={(e) => handleFilterChange("gender", e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </Select>
                        </div>
                        <div className="flex items-end gap-2">
                            <Button 
                                onClick={handleSearch}
                                className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white border-0"
                            >
                                Search
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={handleClearFilters}
                                className="border-[#000080] text-[#000080]"
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="text-[#000080]">
                        {pagination.total} Voters Found
                    </CardTitle>
                    <CardDescription>
                        Page {pagination.page} of {pagination.totalPages}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-4 border-[#000080] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : voters.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Users className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-gray-500 text-center">
                                No voters found matching your criteria.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {voters.map((voter) => (
                                <div 
                                    key={voter._id} 
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#FF9933] transition-colors cursor-pointer"
                                    onClick={() => setSelectedVoter(voter)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-0.5">
                                            {voter.imageUrl ? (
                                                <img 
                                                    src={voter.imageUrl} 
                                                    alt={`${voter.firstName}`}
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                                    <User className="w-6 h-6 text-[#000080]" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {voter.firstName || "N/A"} {voter.lastName || ""}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                ID: {voter.uniqueVoterId || "N/A"}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {voter.email || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right space-y-1">
                                            <p className="text-sm font-medium text-[#000080]">
                                                {voter.gender ? voter.gender.charAt(0).toUpperCase() + voter.gender.slice(1) : "N/A"}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {voter.state || "N/A"}, {voter.district || "N/A"}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                DOB: {voter.dob ? new Date(voter.dob).toLocaleDateString() : "N/A"}
                                            </p>
                                        </div>
                                        <div className="w-3 h-3 rounded-full bg-[#138808]"></div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex items-center justify-between pt-4 border-t">
                                <p className="text-sm text-gray-500">
                                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className="border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Previous
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (pagination.totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (pagination.page <= 3) {
                                                pageNum = i + 1;
                                            } else if (pagination.page >= pagination.totalPages - 2) {
                                                pageNum = pagination.totalPages - 4 + i;
                                            } else {
                                                pageNum = pagination.page - 2 + i;
                                            }
                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={pagination.page === pageNum ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={pagination.page === pageNum 
                                                        ? "bg-[#FF9933] hover:bg-[#FF9933]/90 border-0" 
                                                        : "border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white"
                                                    }
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.totalPages}
                                        className="border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!selectedVoter} onClose={() => setSelectedVoter(null)}>
                <DialogHeader>
                    <DialogTitle>Voter Details</DialogTitle>
                    <button 
                        onClick={() => setSelectedVoter(null)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>
                <DialogContent>
                    {selectedVoter && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-1">
                                    {selectedVoter.imageUrl ? (
                                        <img 
                                            src={selectedVoter.imageUrl} 
                                            alt={`${selectedVoter.firstName}`}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                            <User className="w-10 h-10 text-[#000080]" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {selectedVoter.firstName || "N/A"} {selectedVoter.lastName || ""}
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <IdCard className="w-4 h-4" />
                                        Voter ID: {selectedVoter.uniqueVoterId || "N/A"}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Reference: {selectedVoter.referenceId || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-[#000080] flex items-center gap-2">
                                    <User className="w-4 h-4" /> Personal Information
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Gender</p>
                                            <p className="text-sm font-medium capitalize">{selectedVoter.gender || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Date of Birth
                                            </p>
                                            <p className="text-sm font-medium">
                                                {selectedVoter.dob ? new Date(selectedVoter.dob).toLocaleDateString() : "N/A"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Phone className="w-3 h-3" /> Phone Number
                                            </p>
                                            <p className="text-sm font-medium">{selectedVoter.phoneNumber || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Mail className="w-3 h-3" /> Email
                                            </p>
                                            <p className="text-sm font-medium">{selectedVoter.email || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Hash className="w-3 h-3" /> Aadhar Number
                                            </p>
                                            <p className="text-sm font-medium">{selectedVoter.aadharNumber || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-[#000080] flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Electoral Location
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500">State</p>
                                            <p className="text-sm font-medium">{selectedVoter.state || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">District</p>
                                            <p className="text-sm font-medium">{selectedVoter.district || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Assembly</p>
                                            <p className="text-sm font-medium">{selectedVoter.assembley || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Constituency</p>
                                            <p className="text-sm font-medium">{selectedVoter.consituency || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Booth Number</p>
                                            <p className="text-sm font-medium">{selectedVoter.boothNumber || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedVoter.address && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-[#000080] flex items-center gap-2">
                                        <Building className="w-4 h-4" /> Residential Address
                                    </h4>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-500">House Number</p>
                                                <p className="text-sm font-medium">{selectedVoter.address.houseNumber || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Village/Town</p>
                                                <p className="text-sm font-medium">{selectedVoter.address.village || "N/A"}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500">Tehsil</p>
                                                    <p className="text-sm font-medium">{selectedVoter.address.tehsil || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Post Office</p>
                                                    <p className="text-sm font-medium">{selectedVoter.address.postOffice || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Police Station</p>
                                                    <p className="text-sm font-medium">{selectedVoter.address.policeStation || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">District</p>
                                                    <p className="text-sm font-medium">{selectedVoter.address.district || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">State</p>
                                                    <p className="text-sm font-medium">{selectedVoter.address.state || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Pincode</p>
                                                    <p className="text-sm font-medium">{selectedVoter.address.pincode || "N/A"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedVoter.relative && selectedVoter.relative.type && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-[#000080] flex items-center gap-2">
                                        <Users className="w-4 h-4" /> Family Reference
                                    </h4>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Relation</p>
                                                <p className="text-sm font-medium capitalize">{selectedVoter.relative.type || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Name</p>
                                                <p className="text-sm font-medium">{selectedVoter.relative.name || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedVoter.disability && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-[#000080] flex items-center gap-2">
                                        <User className="w-4 h-4" /> Disability
                                    </h4>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Type</p>
                                                <p className="text-sm font-medium capitalize">
                                                    {selectedVoter.disability.type || "None"}
                                                </p>
                                            </div>
                                            {selectedVoter.disability.type && selectedVoter.disability.type !== "none" && (
                                                <div>
                                                    <p className="text-xs text-gray-500">Certificate</p>
                                                    {selectedVoter.disability.certificate ? (
                                                        <a 
                                                            href={selectedVoter.disability.certificate} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-sm font-medium text-[#FF9933] hover:underline"
                                                        >
                                                            View Certificate
                                                        </a>
                                                    ) : (
                                                        <p className="text-sm font-medium text-gray-400">N/A</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
