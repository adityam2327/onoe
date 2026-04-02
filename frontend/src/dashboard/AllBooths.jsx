import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { getAllBooths, createBooth, updateBooth, deleteBooth, getStates, getAllPCS, getAllACS } from "@/api/booths.api";
import { Building2, RefreshCw, ChevronLeft, ChevronRight, X, Plus, Pencil, Trash2, MapPin, Hash } from "lucide-react";
import toast from "react-hot-toast";

export const AllBooths = () => {
    const [states, setStates] = useState([]);
    const [allPCs, setAllPCs] = useState([]);
    const [allACs, setAllACs] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    const [booths, setBooths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

    const [filters, setFilters] = useState({ state_code: "", pc_code: "", ac_code: "" });

    const [selectedBooth, setSelectedBooth] = useState(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [createFormData, setCreateFormData] = useState({
        ac_code: "", booth_no: "", booth_name: ""
    });
    const [editFormData, setEditFormData] = useState({
        id: "", ac_code: "", booth_no: "", booth_name: ""
    });
    const [deleteBoothData, setDeleteBoothData] = useState(null);

    useEffect(() => {
        loadAllData();
        fetchBooths();
    }, []);

    const loadAllData = async () => {
        setDataLoading(true);
        try {
            const [statesRes, pcsRes, acsRes] = await Promise.all([
                getStates(), getAllPCS(), getAllACS()
            ]);
            const rawStates = statesRes.data || [];
            const rawPCs = pcsRes.data || [];
            const rawACs = acsRes.data || [];

            setStates([...rawStates].sort((a, b) => a.state_name.localeCompare(b.state_name)));
            setAllPCs([...rawPCs].sort((a, b) => a.pc_name.localeCompare(b.pc_name)));
            setAllACs([...rawACs].sort((a, b) => a.assembly_name.localeCompare(b.assembly_name)));
        } catch (error) {
            console.error("Failed to load data:", error);
            toast.error("Failed to load filter data");
        } finally {
            setDataLoading(false);
        }
    };

    const filterPCs = filters.state_code
        ? allPCs.filter(pc => pc.state_code === filters.state_code)
        : [];

    const filterACs = filters.pc_code
        ? allACs.filter(ac => ac.pc_code === filters.pc_code)
        : [];

    const getStateName = (code) => states.find(s => s.state_code === code)?.state_name || code;
    const getPCName = (code) => allPCs.find(p => p.pc_code === code)?.pc_name || code;
    const getACName = (code) => allACs.find(a => a.assembly_code === code)?.assembly_name || code;

    const fetchBooths = async (page = 1) => {
        setLoading(true);
        try {
            const params = { page, limit: pagination.limit };
            if (filters.state_code) params.state_code = filters.state_code;
            if (filters.pc_code) params.pc_code = filters.pc_code;
            if (filters.ac_code) params.ac_code = filters.ac_code;

            const response = await getAllBooths(params);
            setBooths(response.data.booths);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error("Failed to fetch booths:", error);
            toast.error("Failed to fetch booths");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) fetchBooths(newPage);
    };

    const handleFilterChange = (key, value) => {
        const updated = { ...filters, [key]: value };
        if (key === "state_code") { updated.pc_code = ""; updated.ac_code = ""; }
        if (key === "pc_code") { updated.ac_code = ""; }
        setFilters(updated);
    };

    const handleCreateBooth = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await createBooth({
                ac_code: createFormData.ac_code,
                booth_no: createFormData.booth_no,
                booth_name: createFormData.booth_name
            });
            toast.success("Booth created successfully");
            setShowCreateDialog(false);
            setCreateFormData({ ac_code: "", booth_no: "", booth_name: "" });
            fetchBooths(1);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const openEditDialog = (booth) => {
        setEditFormData({
            id: booth._id,
            ac_code: booth.ac_code,
            booth_no: booth.booth_no,
            booth_name: booth.booth_name
        });
        setShowEditDialog(true);
    };

    const handleEditBooth = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await updateBooth(editFormData.id, {
                booth_no: editFormData.booth_no,
                booth_name: editFormData.booth_name
            });
            toast.success("Booth updated successfully");
            setShowEditDialog(false);
            fetchBooths(pagination.page);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const openDeleteDialog = (booth) => {
        setDeleteBoothData(booth);
        setShowDeleteDialog(true);
    };

    const handleDeleteBooth = async () => {
        setActionLoading(true);
        try {
            await deleteBooth(deleteBoothData._id);
            toast.success("Booth deleted successfully");
            setShowDeleteDialog(false);
            setDeleteBoothData(null);
            fetchBooths(pagination.page);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#000080]">All Booths</h2>
                    <p className="text-gray-500">View and manage polling booths</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => fetchBooths(pagination.page)}
                        className="border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white">
                        <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                    </Button>
                    <Button onClick={() => setShowCreateDialog(true)}
                        className="bg-[#138808] hover:bg-[#138808]/90 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Create Booth
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-[#000080]">Filter Booths</CardTitle>
                    <CardDescription>Filter by State, Parliamentary Constituency, or Assembly Constituency</CardDescription>
                </CardHeader>
                <CardContent>
                    {dataLoading ? (
                        <div className="flex items-center justify-center py-6">
                            <div className="w-6 h-6 border-4 border-[#000080] border-t-transparent rounded-full animate-spin mr-3"></div>
                            <span className="text-gray-500">Loading filter data...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="space-y-2">
                                <Label>State</Label>
                                <Select value={filters.state_code} onChange={(e) => handleFilterChange("state_code", e.target.value)}>
                                    <option value="">All States</option>
                                    {states.map((s) => <option key={s._id} value={s.state_code}>{s.state_name}</option>)}
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Parl. Constituency</Label>
                                <Select value={filters.pc_code} onChange={(e) => handleFilterChange("pc_code", e.target.value)}>
                                    <option value="">{filters.state_code ? "All PCs" : "Select State first"}</option>
                                    {filterPCs.map((pc) => <option key={pc._id} value={pc.pc_code}>{pc.pc_name}</option>)}
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Assembly Constituency</Label>
                                <Select value={filters.ac_code} onChange={(e) => handleFilterChange("ac_code", e.target.value)}>
                                    <option value="">{filters.pc_code ? "All ACs" : "Select PC first"}</option>
                                    {filterACs.map((ac) => <option key={ac._id} value={ac.assembly_code}>{ac.assembly_name}</option>)}
                                </Select>
                            </div>
                            <div className="flex items-end">
                                <Button onClick={() => fetchBooths(1)}
                                    className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white border-0 w-full">
                                    Search
                                </Button>
                            </div>
                            <div className="flex items-end">
                                <Button variant="outline" onClick={() => { setFilters({ state_code: "", pc_code: "", ac_code: "" }); fetchBooths(1); }}
                                    className="border-[#000080] text-[#000080] w-full">
                                    Clear
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-[#000080]">{pagination.total} Booths Found</CardTitle>
                    <CardDescription>Page {pagination.page} of {pagination.totalPages || 1}</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-4 border-[#000080] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : booths.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Building2 className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-gray-500">No booths found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {booths.map((booth) => {
                                const acInfo = allACs.find(a => a.assembly_code === booth.ac_code);
                                return (
                                    <div key={booth._id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#FF9933] transition-colors">
                                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedBooth(booth)}>
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-0.5">
                                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                                    <Building2 className="w-6 h-6 text-[#000080]" />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{booth.booth_name}</p>
                                                <p className="text-sm text-gray-500">Booth No: {booth.booth_no}</p>
                                                {acInfo && (
                                                    <p className="text-xs text-gray-400">{acInfo.assembly_name} ({booth.ac_code})</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditDialog(booth)}
                                                className="border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white">
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => openDeleteDialog(booth)}
                                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="flex items-center justify-between pt-4 border-t">
                                <p className="text-sm text-gray-500">
                                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className="border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white">
                                        <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                                    </Button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (pagination.totalPages <= 5) pageNum = i + 1;
                                            else if (pagination.page <= 3) pageNum = i + 1;
                                            else if (pagination.page >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
                                            else pageNum = pagination.page - 2 + i;
                                            return (
                                                <Button key={pageNum} variant={pagination.page === pageNum ? "default" : "outline"} size="sm"
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={pagination.page === pageNum ? "bg-[#FF9933] hover:bg-[#FF9933]/90 border-0" : "border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white"}>
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.totalPages}
                                        className="border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white">
                                        Next <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!selectedBooth} onClose={() => setSelectedBooth(null)}>
                <DialogHeader>
                    <DialogTitle>Booth Details</DialogTitle>
                    <button onClick={() => setSelectedBooth(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>
                <DialogContent>
                    {selectedBooth && (() => {
                        const acInfo = allACs.find(a => a.assembly_code === selectedBooth.ac_code);
                        return (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 pb-4 border-b">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-1">
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                            <Building2 className="w-8 h-8 text-[#000080]" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{selectedBooth.booth_name}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Hash className="w-4 h-4" /> Booth No: {selectedBooth.booth_no}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-[#000080] flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> Location
                                    </h4>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                        {acInfo && (
                                            <>
                                                <div>
                                                    <p className="text-xs text-gray-500">State</p>
                                                    <p className="text-sm font-medium">{getStateName(acInfo.state_code)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Parliamentary Constituency</p>
                                                    <p className="text-sm font-medium">{getPCName(acInfo.pc_code)}</p>
                                                </div>
                                            </>
                                        )}
                                        <div>
                                            <p className="text-xs text-gray-500">Assembly Constituency</p>
                                            <p className="text-sm font-medium">
                                                {acInfo ? `${acInfo.assembly_name} (${selectedBooth.ac_code})` : selectedBooth.ac_code}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Booth Number</p>
                                                <p className="text-sm font-medium">{selectedBooth.booth_no}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Booth Name</p>
                                                <p className="text-sm font-medium">{selectedBooth.booth_name}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </DialogContent>
            </Dialog>

            <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)}>
                <DialogHeader>
                    <DialogTitle>Create New Booth</DialogTitle>
                    <button onClick={() => setShowCreateDialog(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>
                <DialogContent>
                    <form onSubmit={handleCreateBooth} className="space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-[#000080]">Booth Details</h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label>Assembly Constituency Code *</Label>
                                    <Input placeholder="e.g. 58" value={createFormData.ac_code}
                                        onChange={(e) => setCreateFormData(prev => ({ ...prev, ac_code: e.target.value }))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Booth Number *</Label>
                                    <Input placeholder="e.g. 01" value={createFormData.booth_no}
                                        onChange={(e) => setCreateFormData(prev => ({ ...prev, booth_no: e.target.value }))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Booth Name *</Label>
                                    <Input placeholder="e.g. Govt Primary School, Sector 12" value={createFormData.booth_name}
                                        onChange={(e) => setCreateFormData(prev => ({ ...prev, booth_name: e.target.value }))} required />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}
                                className="border-[#000080] text-[#000080]">Cancel</Button>
                            <Button type="submit" disabled={actionLoading}
                                className="bg-[#138808] hover:bg-[#138808]/90 text-white">
                                {actionLoading ? "Creating..." : "Create Booth"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)}>
                <DialogHeader>
                    <DialogTitle>Edit Booth</DialogTitle>
                    <button onClick={() => setShowEditDialog(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>
                <DialogContent>
                    <form onSubmit={handleEditBooth} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Assembly Constituency</Label>
                                <Input value={`${getACName(editFormData.ac_code)} (${editFormData.ac_code})`} disabled className="bg-gray-100" />
                            </div>
                            <div className="space-y-2">
                                <Label>Booth Number *</Label>
                                <Input value={editFormData.booth_no}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, booth_no: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Booth Name *</Label>
                                <Input value={editFormData.booth_name}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, booth_name: e.target.value }))} required />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}
                                className="border-[#000080] text-[#000080]">Cancel</Button>
                            <Button type="submit" disabled={actionLoading}
                                className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white">
                                {actionLoading ? "Updating..." : "Update Booth"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                <DialogHeader>
                    <DialogTitle className="text-red-600">Delete Booth</DialogTitle>
                    <button onClick={() => setShowDeleteDialog(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>
                <DialogContent>
                    {deleteBoothData && (
                        <div className="space-y-4">
                            <p className="text-gray-600">Are you sure you want to delete this booth?</p>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="font-semibold text-gray-800">{deleteBoothData.booth_name}</p>
                                <p className="text-sm text-gray-500">Booth No: {deleteBoothData.booth_no}</p>
                                <p className="text-sm text-gray-500">AC Code: {deleteBoothData.ac_code}</p>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}
                                    className="border-[#000080] text-[#000080]">Cancel</Button>
                                <Button onClick={handleDeleteBooth} disabled={actionLoading}
                                    className="bg-red-600 hover:bg-red-700 text-white">
                                    {actionLoading ? "Deleting..." : "Delete"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
