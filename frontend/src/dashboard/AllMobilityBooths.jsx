import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { getAllMobilityBooths, createMobilityBooth, updateMobilityBooth, deleteMobilityBooth } from "@/api/booths.api";
import { Truck, RefreshCw, ChevronLeft, ChevronRight, X, Plus, Pencil, Trash2, MapPin, Phone, User } from "lucide-react";
import toast from "react-hot-toast";

export const AllMobilityBooths = () => {
    const [booths, setBooths] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [selectedBooth, setSelectedBooth] = useState(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [createFormData, setCreateFormData] = useState({
        boothId: "", boothName: "", areaName: "", address: "", contactPerson: "", contactPhone: "", longitude: "", latitude: "", totalCapacity: ""
    });
    const [editFormData, setEditFormData] = useState({
        id: "", boothName: "", areaName: "", address: "", contactPerson: "", contactPhone: "", longitude: "", latitude: "", totalCapacity: "", isActive: true
    });
    const [deleteBoothData, setDeleteBoothData] = useState(null);

    useEffect(() => {
        fetchBooths();
    }, []);

    const fetchBooths = async (page = 1) => {
        setLoading(true);
        try {
            const params = { page, limit: pagination.limit };
            if (searchTerm) params.search = searchTerm;
            if (statusFilter) params.isActive = statusFilter;
            const response = await getAllMobilityBooths(params);
            setBooths(response.data.booths || []);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error("Failed to fetch mobility booths:", error);
            toast.error(error.message || "Failed to fetch mobility booths");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBooths(1);
    };

    const handleClear = () => {
        setSearchTerm("");
        setStatusFilter("");
        fetchBooths(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) fetchBooths(newPage);
    };

    const handleCreateBooth = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await createMobilityBooth({
                boothId: createFormData.boothId,
                boothName: createFormData.boothName,
                areaName: createFormData.areaName,
                address: createFormData.address,
                contactPerson: createFormData.contactPerson,
                contactPhone: createFormData.contactPhone,
                coordinates: [parseFloat(createFormData.longitude), parseFloat(createFormData.latitude)],
                totalCapacity: parseInt(createFormData.totalCapacity)
            });
            toast.success("Mobility booth created successfully");
            setShowCreateDialog(false);
            setCreateFormData({ boothId: "", boothName: "", areaName: "", address: "", contactPerson: "", contactPhone: "", longitude: "", latitude: "", totalCapacity: "" });
            fetchBooths(1);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const openEditDialog = (booth) => {
        const coords = booth.location?.coordinates || [0, 0];
        setEditFormData({
            id: booth._id,
            boothName: booth.boothName,
            areaName: booth.areaName,
            address: booth.address,
            contactPerson: booth.contactPerson,
            contactPhone: booth.contactPhone,
            longitude: coords[0].toString(),
            latitude: coords[1].toString(),
            totalCapacity: booth.totalCapacity.toString(),
            isActive: booth.isActive
        });
        setShowEditDialog(true);
    };

    const handleEditBooth = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        try {
            await updateMobilityBooth(editFormData.id, {
                boothName: editFormData.boothName,
                areaName: editFormData.areaName,
                address: editFormData.address,
                contactPerson: editFormData.contactPerson,
                contactPhone: editFormData.contactPhone,
                coordinates: [parseFloat(editFormData.longitude), parseFloat(editFormData.latitude)],
                totalCapacity: parseInt(editFormData.totalCapacity),
                isActive: editFormData.isActive
            });
            toast.success("Mobility booth updated successfully");
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
            await deleteMobilityBooth(deleteBoothData._id);
            toast.success("Mobility booth deleted successfully");
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
                    <h2 className="text-2xl font-bold text-[#000080]">All Mobility Booths</h2>
                    <p className="text-gray-500">View and manage mobile polling booths</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => fetchBooths(pagination.page)}
                        className="border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white">
                        <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                    </Button>
                    <Button onClick={() => setShowCreateDialog(true)}
                        className="bg-[#138808] hover:bg-[#138808]/90 text-white">
                        <Plus className="w-4 h-4 mr-2" /> Create Mobility Booth
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-[#000080]">Search & Filter Mobility Booths</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 flex-wrap">
                        <Input
                            placeholder="Search by booth name, ID or area..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="flex-1 min-w-[200px]"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border rounded-md"
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
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
                    <CardTitle className="text-[#000080]">{pagination.total} Mobility Booths Found</CardTitle>
                    <CardDescription>Page {pagination.page} of {pagination.totalPages || 1}</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-8 h-8 border-4 border-[#000080] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : booths.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Truck className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-gray-500">No mobility booths found.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {booths.map((booth) => (
                                <div key={booth._id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#FF9933] transition-colors">
                                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedBooth(booth)}>
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-0.5">
                                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                                <Truck className="w-6 h-6 text-[#000080]" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{booth.boothName}</p>
                                            <p className="text-sm text-gray-500">{booth.areaName}</p>
                                            <p className="text-xs text-gray-400">{booth.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${booth.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {booth.isActive ? 'Active' : 'Inactive'}
                                        </span>
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

            <Dialog open={!!selectedBooth} onClose={() => setSelectedBooth(null)}>
                <DialogHeader>
                    <DialogTitle>Mobility Booth Details</DialogTitle>
                    <button onClick={() => setSelectedBooth(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>
                <DialogContent>
                    {selectedBooth && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-4 border-b">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-1">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                        <Truck className="w-8 h-8 text-[#000080]" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{selectedBooth.boothName}</h3>
                                    <p className="text-sm text-gray-500">ID: {selectedBooth.boothId}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500">Area Name</p>
                                    <p className="text-sm font-medium">{selectedBooth.areaName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Address</p>
                                    <p className="text-sm font-medium">{selectedBooth.address}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Contact Person</p>
                                    <p className="text-sm font-medium flex items-center gap-2">
                                        <User className="w-4 h-4" /> {selectedBooth.contactPerson}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Contact Phone</p>
                                    <p className="text-sm font-medium flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> {selectedBooth.contactPhone}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Total Capacity</p>
                                        <p className="text-sm font-medium">{selectedBooth.totalCapacity}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Current Queue</p>
                                        <p className="text-sm font-medium">{selectedBooth.currentQueue}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Status</p>
                                    <span className={`px-2 py-1 text-xs rounded-full ${selectedBooth.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {selectedBooth.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)}>
                <DialogHeader>
                    <DialogTitle>Create New Mobility Booth</DialogTitle>
                    <button onClick={() => setShowCreateDialog(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>
                <DialogContent>
                    <form onSubmit={handleCreateBooth} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Booth ID *</Label>
                                    <Input placeholder="e.g. MB001" value={createFormData.boothId}
                                        onChange={(e) => setCreateFormData(prev => ({ ...prev, boothId: e.target.value }))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Total Capacity *</Label>
                                    <Input type="number" placeholder="e.g. 500" value={createFormData.totalCapacity}
                                        onChange={(e) => setCreateFormData(prev => ({ ...prev, totalCapacity: e.target.value }))} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Booth Name *</Label>
                                <Input placeholder="e.g. Mobile Booth 1" value={createFormData.boothName}
                                    onChange={(e) => setCreateFormData(prev => ({ ...prev, boothName: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Area Name *</Label>
                                <Input placeholder="e.g. Sector 15" value={createFormData.areaName}
                                    onChange={(e) => setCreateFormData(prev => ({ ...prev, areaName: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Address *</Label>
                                <Input placeholder="e.g. Main Market, Sector 15" value={createFormData.address}
                                    onChange={(e) => setCreateFormData(prev => ({ ...prev, address: e.target.value }))} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Contact Person *</Label>
                                    <Input placeholder="e.g. John Doe" value={createFormData.contactPerson}
                                        onChange={(e) => setCreateFormData(prev => ({ ...prev, contactPerson: e.target.value }))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Contact Phone *</Label>
                                    <Input placeholder="e.g. 9876543210" value={createFormData.contactPhone}
                                        onChange={(e) => setCreateFormData(prev => ({ ...prev, contactPhone: e.target.value }))} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Longitude *</Label>
                                    <Input type="number" step="any" placeholder="e.g. 77.1025" value={createFormData.longitude}
                                        onChange={(e) => setCreateFormData(prev => ({ ...prev, longitude: e.target.value }))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Latitude *</Label>
                                    <Input type="number" step="any" placeholder="e.g. 28.5667" value={createFormData.latitude}
                                        onChange={(e) => setCreateFormData(prev => ({ ...prev, latitude: e.target.value }))} required />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}
                                className="border-[#000080] text-[#000080]">Cancel</Button>
                            <Button type="submit" disabled={actionLoading}
                                className="bg-[#138808] hover:bg-[#138808]/90 text-white">
                                {actionLoading ? "Creating..." : "Create Mobility Booth"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)}>
                <DialogHeader>
                    <DialogTitle>Edit Mobility Booth</DialogTitle>
                    <button onClick={() => setShowEditDialog(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>
                <DialogContent>
                    <form onSubmit={handleEditBooth} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Total Capacity *</Label>
                                    <Input type="number" value={editFormData.totalCapacity}
                                        onChange={(e) => setEditFormData(prev => ({ ...prev, totalCapacity: e.target.value }))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Active</Label>
                                    <select value={editFormData.isActive ? "true" : "false"} onChange={(e) => setEditFormData(prev => ({ ...prev, isActive: e.target.value === "true" }))}
                                        className="w-full px-3 py-2 border rounded-md">
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Booth Name *</Label>
                                <Input value={editFormData.boothName}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, boothName: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Area Name *</Label>
                                <Input value={editFormData.areaName}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, areaName: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Address *</Label>
                                <Input value={editFormData.address}
                                    onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Contact Person *</Label>
                                    <Input value={editFormData.contactPerson}
                                        onChange={(e) => setEditFormData(prev => ({ ...prev, contactPerson: e.target.value }))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Contact Phone *</Label>
                                    <Input value={editFormData.contactPhone}
                                        onChange={(e) => setEditFormData(prev => ({ ...prev, contactPhone: e.target.value }))} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Longitude *</Label>
                                    <Input type="number" step="any" value={editFormData.longitude}
                                        onChange={(e) => setEditFormData(prev => ({ ...prev, longitude: e.target.value }))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Latitude *</Label>
                                    <Input type="number" step="any" value={editFormData.latitude}
                                        onChange={(e) => setEditFormData(prev => ({ ...prev, latitude: e.target.value }))} required />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}
                                className="border-[#000080] text-[#000080]">Cancel</Button>
                            <Button type="submit" disabled={actionLoading}
                                className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white">
                                {actionLoading ? "Updating..." : "Update Mobility Booth"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                <DialogHeader>
                    <DialogTitle className="text-red-600">Delete Mobility Booth</DialogTitle>
                    <button onClick={() => setShowDeleteDialog(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </DialogHeader>
                <DialogContent>
                    {deleteBoothData && (
                        <div className="space-y-4">
                            <p className="text-gray-600">Are you sure you want to delete this mobility booth?</p>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="font-semibold text-gray-800">{deleteBoothData.boothName}</p>
                                <p className="text-sm text-gray-500">ID: {deleteBoothData.boothId}</p>
                                <p className="text-sm text-gray-500">{deleteBoothData.areaName}</p>
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
