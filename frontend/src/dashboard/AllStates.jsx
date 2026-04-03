import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { getAllStates, createState, updateState, deleteState } from "@/api/booths.api";
import { MapPin, RefreshCw, ChevronLeft, ChevronRight, X, Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export const AllStates = () => {
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedState, setSelectedState] = useState(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [createFormData, setCreateFormData] = useState({
        state_code: "", state_name: "", state_type: ""
    });
    const [editFormData, setEditFormData] = useState({
        id: "", state_name: "", state_type: ""
    });
    const [deleteStateData, setDeleteStateData] = useState(null);

    useEffect(() => {
        fetchStates();
    }, []);

    const fetchStates = async (page = 1) => {
        setLoading(true);
        try {
            const params = { page, limit: pagination.limit };
            if (searchTerm) params.search = searchTerm;
            const response = await getAllStates(params);
            setStates(response.data.states || []);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error("Failed to fetch states:", error);
            toast.error(error.message || "Failed to fetch states");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStates(1);
    };

    const handleClear = () => {
        setSearchTerm("");
        fetchStates(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) fetchStates(newPage);
    };

    const handleCreateState = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await createState({
                state_code: createFormData.state_code,
                state_name: createFormData.state_name,
                state_type: createFormData.state_type
            });
            toast.success("State created successfully");
            setShowCreateDialog(false);
            setCreateFormData({ state_code: "", state_name: "", state_type: "" });
            fetchStates(1);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const openEditDialog = (state) => {
        setEditFormData({
            id: state._id,
            state_name: state.state_name,
            state_type: state.state_type
        });
        setShowEditDialog(true);
    };

    const handleEditState = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await updateState(editFormData.id, {
                state_name: editFormData.state_name,
                state_type: editFormData.state_type
            });
            toast.success("State updated successfully");
            setShowEditDialog(false);
            fetchStates(pagination.page);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const openDeleteDialog = (state) => {
        setDeleteStateData(state);
        setShowDeleteDialog(true);
    };

    const handleDeleteState = async () => {
        setActionLoading(true);
        try {
            await deleteState(deleteStateData._id);
            toast.success("State deleted successfully");
            setShowDeleteDialog(false);
            setDeleteStateData(null);
            fetchStates(pagination.page);
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
                    <h2 className="text-2xl font-bold text-[#000080]">All States</h2>
                    <p className="text-gray-500">View and manage states</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => fetchStates(pagination.page)}
                        className="border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white">
                        <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                    </Button>
                    <Button onClick={() => setShowCreateDialog(true)}
                        className="bg-[#138808] hover:bg-[#138808]/90 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Create State
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-[#000080]">Search States</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Input
                            placeholder="Search by state name or code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch} className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white">
                            Search
                        </Button>
                        <Button variant="outline" onClick={handleClear} className="border-[#000080] text-[#000080]">
                            Clear
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-[#000080]">{pagination.total} States Found</CardTitle>
                    <CardDescription>Page {pagination.page} of {pagination.totalPages || 1}</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-4 border-[#000080] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : states.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <MapPin className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-gray-500">No states found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {states.map((state) => (
                                <div key={state._id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#FF9933] transition-colors">
                                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedState(state)}>
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-0.5">
                                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                                <MapPin className="w-6 h-6 text-[#000080]" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{state.state_name}</p>
                                            <p className="text-sm text-gray-500">Code: {state.state_code}</p>
                                            <p className="text-xs text-gray-400">Type: {state.state_type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => openEditDialog(state)}
                                            className="border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white">
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => openDeleteDialog(state)}
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

            <Dialog open={!!selectedState} onClose={() => setSelectedState(null)}>
                <DialogHeader>
                    <DialogTitle>State Details</DialogTitle>
                    <button onClick={() => setSelectedState(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>
                <DialogContent>
                    {selectedState && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-1">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                        <MapPin className="w-8 h-8 text-[#000080]" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{selectedState.state_name}</h3>
                                    <p className="text-sm text-gray-500">Code: {selectedState.state_code}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div>
                                    <p className="text-xs text-gray-500">State Type</p>
                                    <p className="text-sm font-medium">{selectedState.state_type}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)}>
                <DialogHeader>
                    <DialogTitle>Create New State</DialogTitle>
                    <button onClick={() => setShowCreateDialog(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>
                <DialogContent>
                    <form onSubmit={handleCreateState} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>State Code *</Label>
                                <Input placeholder="e.g. DL" value={createFormData.state_code}
                                    onChange={(e) => setCreateFormData(prev => ({ ...prev, state_code: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label>State Name *</Label>
                                <Input placeholder="e.g. Delhi" value={createFormData.state_name}
                                    onChange={(e) => setCreateFormData(prev => ({ ...prev, state_name: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label>State Type *</Label>
                                <Input placeholder="e.g. UT" value={createFormData.state_type}
                                    onChange={(e) => setCreateFormData(prev => ({ ...prev, state_type: e.target.value }))} required />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}
                                className="border-[#000080] text-[#000080]">Cancel</Button>
                            <Button type="submit" disabled={actionLoading}
                                className="bg-[#138808] hover:bg-[#138808]/90 text-white">
                                {actionLoading ? "Creating..." : "Create State"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)}>
                <DialogHeader>
                    <DialogTitle>Edit State</DialogTitle>
                    <button onClick={() => setShowEditDialog(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>
                <DialogContent>
                    <form onSubmit={handleEditState} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>State Name *</Label>
                                <Input value={editFormData.state_name}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, state_name: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label>State Type *</Label>
                                <Input value={editFormData.state_type}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, state_type: e.target.value }))} required />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}
                                className="border-[#000080] text-[#000080]">Cancel</Button>
                            <Button type="submit" disabled={actionLoading}
                                className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white">
                                {actionLoading ? "Updating..." : "Update State"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                <DialogHeader>
                    <DialogTitle className="text-red-600">Delete State</DialogTitle>
                    <button onClick={() => setShowDeleteDialog(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>
                <DialogContent>
                    {deleteStateData && (
                        <div className="space-y-4">
                            <p className="text-gray-600">Are you sure you want to delete this state?</p>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="font-semibold text-gray-800">{deleteStateData.state_name}</p>
                                <p className="text-sm text-gray-500">Code: {deleteStateData.state_code}</p>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}
                                    className="border-[#000080] text-[#000080]">Cancel</Button>
                                <Button onClick={handleDeleteState} disabled={actionLoading}
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
