import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { getAllPCS, getStatesList, createPC, updatePC, deletePC } from "@/api/booths.api";
import { Building2, RefreshCw, ChevronLeft, ChevronRight, X, Plus, Pencil, Trash2, MapPin, Hash } from "lucide-react";
import toast from "react-hot-toast";

export const AllPCS = () => {
    const [states, setStates] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    const [pcs, setPcs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

    const [filters, setFilters] = useState({ state_code: "" });

    const [selectedPC, setSelectedPC] = useState(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [createFormData, setCreateFormData] = useState({
        state_code: "", pc_code: "", pc_name: ""
    });
    const [editFormData, setEditFormData] = useState({
        id: "", pc_name: ""
    });
    const [deletePCData, setDeletePCData] = useState(null);

    useEffect(() => {
        loadAllData();
        fetchPCs();
    }, []);

    const loadAllData = async () => {
        setDataLoading(true);
        try {
            const statesRes = await getStatesList();
            setStates([...statesRes.data].sort((a, b) => a.state_name.localeCompare(b.state_name)));
        } catch (error) {
            console.error("Failed to load data:", error);
            toast.error(error.message || "Failed to load filter data");
        } finally {
            setDataLoading(false);
        }
    };

    const getStateName = (code) => states.find(s => s.state_code === code)?.state_name || code;

    const fetchPCs = async (page = 1) => {
        setLoading(true);
        try {
            const params = { page, limit: pagination.limit };
            if (filters.state_code) params.state_code = filters.state_code;

            const response = await getAllPCS(params);
            setPcs(response.data.pcs || []);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error("Failed to fetch PCs:", error);
            toast.error(error.message || "Failed to fetch PCs");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) fetchPCs(newPage);
    };

    const handleCreatePC = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await createPC({
                state_code: createFormData.state_code,
                pc_code: createFormData.pc_code,
                pc_name: createFormData.pc_name
            });
            toast.success("PC created successfully");
            setShowCreateDialog(false);
            setCreateFormData({ state_code: "", pc_code: "", pc_name: "" });
            fetchPCs(1);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const openEditDialog = (pc) => {
        setEditFormData({
            id: pc._id,
            pc_name: pc.pc_name
        });
        setShowEditDialog(true);
    };

    const handleEditPC = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await updatePC(editFormData.id, {
                pc_name: editFormData.pc_name
            });
            toast.success("PC updated successfully");
            setShowEditDialog(false);
            fetchPCs(pagination.page);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const openDeleteDialog = (pc) => {
        setDeletePCData(pc);
        setShowDeleteDialog(true);
    };

    const handleDeletePC = async () => {
        setActionLoading(true);
        try {
            await deletePC(deletePCData._id);
            toast.success("PC deleted successfully");
            setShowDeleteDialog(false);
            setDeletePCData(null);
            fetchPCs(pagination.page);
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
                    <h2 className="text-2xl font-bold text-[#000080]">All Parliamentary Constituencies</h2>
                    <p className="text-gray-500">View and manage Parliamentary Constituencies</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => fetchPCs(pagination.page)}
                        className="border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white">
                        <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                    </Button>
                    <Button onClick={() => setShowCreateDialog(true)}
                        className="bg-[#138808] hover:bg-[#138808]/90 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Create Parliamentary Constituency
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-[#000080]">Filter Parliamentary Constituencies</CardTitle>
                    <CardDescription>Filter by State</CardDescription>
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
                                <Select value={filters.state_code} onChange={(e) => setFilters({ state_code: e.target.value })}>
                                    <option value="">All States</option>
                                    {states.map((s) => <option key={s._id} value={s.state_code}>{s.state_name}</option>)}
                                </Select>
                            </div>
                            <div className="flex items-end">
                                <Button onClick={() => fetchPCs(1)}
                                    className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white border-0 w-full">
                                    Search
                                </Button>
                            </div>
                            <div className="flex items-end">
                                <Button variant="outline" onClick={() => { setFilters({ state_code: "" }); fetchPCs(1); }}
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
                    <CardTitle className="text-[#000080]">{pagination.total} Parliamentary Constituencies Found</CardTitle>
                    <CardDescription>Page {pagination.page} of {pagination.totalPages || 1}</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-4 border-[#000080] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : pcs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Building2 className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-gray-500">No Parliamentary Constituencies found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pcs.map((pc) => (
                                <div key={pc._id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#FF9933] transition-colors">
                                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedPC(pc)}>
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-0.5">
                                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                                <Building2 className="w-6 h-6 text-[#000080]" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{pc.pc_name}</p>
                                            <p className="text-sm text-gray-500">Parliamentary Constituency Code: {pc.pc_code}</p>
                                            <p className="text-xs text-gray-400">{getStateName(pc.state_code)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => openEditDialog(pc)}
                                            className="border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => openDeleteDialog(pc)}
                                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

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

            <Dialog open={!!selectedPC} onClose={() => setSelectedPC(null)}>
                <DialogHeader>
                    <DialogTitle>Parliamentary Constituency Details</DialogTitle>
                    <button onClick={() => setSelectedPC(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>
                <DialogContent>
                    {selectedPC && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-1">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                        <Building2 className="w-8 h-8 text-[#000080]" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{selectedPC.pc_name}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Hash className="w-4 h-4" /> Parliamentary Constituency Code: {selectedPC.pc_code}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div>
                                    <p className="text-xs text-gray-500">State</p>
                                    <p className="text-sm font-medium">{getStateName(selectedPC.state_code)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)}>
                <DialogHeader>
                    <DialogTitle>Create New Parliamentary Constituency</DialogTitle>
                    <button onClick={() => setShowCreateDialog(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>
                <DialogContent>
                    <form onSubmit={handleCreatePC} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>State *</Label>
                                <Select value={createFormData.state_code} onChange={(e) => setCreateFormData(prev => ({ ...prev, state_code: e.target.value }))} required>
                                    <option value="">Select State</option>
                                    {states.map((s) => <option key={s._id} value={s.state_code}>{s.state_name}</option>)}
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Parliamentary Constituency Code *</Label>
                                <Input placeholder="e.g. PC001" value={createFormData.pc_code}
                                    onChange={(e) => setCreateFormData(prev => ({ ...prev, pc_code: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Parliamentary Constituency Name *</Label>
                                <Input placeholder="e.g. North Delhi" value={createFormData.pc_name}
                                    onChange={(e) => setCreateFormData(prev => ({ ...prev, pc_name: e.target.value }))} required />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}
                                className="border-[#000080] text-[#000080]">Cancel</Button>
                            <Button type="submit" disabled={actionLoading}
                                className="bg-[#138808] hover:bg-[#138808]/90 text-white">
                                {actionLoading ? "Creating..." : "Create Parliamentary Constituency"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)}>
                <DialogHeader>
                    <DialogTitle>Edit Parliamentary Constituency</DialogTitle>
                    <button onClick={() => setShowEditDialog(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>
                <DialogContent>
                    <form onSubmit={handleEditPC} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>PC Name *</Label>
                                <Input value={editFormData.pc_name}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, pc_name: e.target.value }))} required />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}
                                className="border-[#000080] text-[#000080]">Cancel</Button>
                            <Button type="submit" disabled={actionLoading}
                                className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white">
                                {actionLoading ? "Updating..." : "Update PC"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                <DialogHeader>
                    <DialogTitle className="text-red-600">Delete PC</DialogTitle>
                    <button onClick={() => setShowDeleteDialog(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>
                <DialogContent>
                    {deletePCData && (
                        <div className="space-y-4">
                            <p className="text-gray-600">Are you sure you want to delete this PC?</p>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="font-semibold text-gray-800">{deletePCData.pc_name}</p>
                                <p className="text-sm text-gray-500">Parliamentary Constituency Code: {deletePCData.pc_code}</p>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}
                                    className="border-[#000080] text-[#000080]">Cancel</Button>
                                <Button onClick={handleDeletePC} disabled={actionLoading}
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
