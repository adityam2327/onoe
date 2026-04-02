import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentOfficer, createOfficer } from "@/api/officer.api";
import { ArrowLeft, Loader2, UserPlus, Building2, User, Shield, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const roleHierarchy = {
    "ECI HQ": "CEO",
    "CEO": "DEO",
    "DEO": "ERO",
    "ERO": "BLO"
};

export const CreateOfficer = () => {
    const navigate = useNavigate();
    const [officer, setOfficer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        state: "",
        district: "",
        assembly: "",
        constituency: ""
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchOfficer = async () => {
            try {
                const response = await getCurrentOfficer();
                setOfficer(response.data);
            } catch (error) {
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchOfficer();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name || formData.name.length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        }
        
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email";
        }
        
        if (!formData.password || formData.password.length < 6) {
            newErrors.password = "Password must be 6+ characters";
        }
        
        if (formData.phoneNumber && formData.phoneNumber.length !== 10) {
            newErrors.phoneNumber = "Phone must be 10 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            await createOfficer(formData);
            toast.success(`${officer.role === "ECI HQ" ? "CEO" : roleHierarchy[officer.role]} created successfully!`);
            navigate("/dashboard/officers");
        } catch (error) {
            toast.error(error.message || "Failed to create officer");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#000080] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const creatingRole = roleHierarchy[officer.role];

    if (!creatingRole) {
        return (
            <Card className="max-w-md mx-auto">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Building2 className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-center">You don't have permission to create officers.</p>
                    <Link to="/dashboard" className="mt-4">
                        <Button className="bg-[#000080] hover:bg-[#000080]/90 text-white border-0">
                            Back to Dashboard
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/dashboard/officers" className="text-gray-500 hover:text-[#000080]">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF9933] to-[#138808] flex items-center justify-center">
                        <span className="text-white text-lg font-bold">{creatingRole.charAt(0)}</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#000080]">Create {creatingRole}</h1>
                        <p className="text-gray-500 text-sm">Add a new {creatingRole.toLowerCase()} officer</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="border-t-4 border-t-[#FF9933]">
                    <CardHeader className="bg-gray-50/50 pb-4">
                        <CardTitle className="text-[#000080] flex items-center gap-2 text-lg">
                            <User className="w-5 h-5" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-700">
                                    Full Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`h-11 ${errors.name ? "border-red-500" : "border-gray-200 focus:border-[#000080]"}`}
                                    disabled={submitting}
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber" className="text-gray-700">Phone</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    placeholder="10-digit number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className={`h-11 ${errors.phoneNumber ? "border-red-500" : "border-gray-200 focus:border-[#000080]"}`}
                                    disabled={submitting}
                                    maxLength={10}
                                />
                                {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-t-4 border-t-[#000080]">
                    <CardHeader className="bg-gray-50/50 pb-4">
                        <CardTitle className="text-[#000080] flex items-center gap-2 text-lg">
                            <Shield className="w-5 h-5" />
                            Login Credentials
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700">
                                    Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="official@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`h-11 ${errors.email ? "border-red-500" : "border-gray-200 focus:border-[#000080]"}`}
                                    disabled={submitting}
                                />
                                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700">
                                    Password <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Min 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`h-11 ${errors.password ? "border-red-500" : "border-gray-200 focus:border-[#000080]"}`}
                                    disabled={submitting}
                                />
                                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-t-4 border-t-[#138808]">
                    <CardHeader className="bg-gray-50/50 pb-4">
                        <CardTitle className="text-[#000080] flex items-center gap-2 text-lg">
                            <MapPin className="w-5 h-5" />
                            Posting Address
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="state" className="text-gray-700">State</Label>
                                <Input
                                    id="state"
                                    name="state"
                                    placeholder="Enter state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="h-11 border-gray-200 focus:border-[#000080]"
                                    disabled={submitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="district" className="text-gray-700">District</Label>
                                <Input
                                    id="district"
                                    name="district"
                                    placeholder="Enter district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    className="h-11 border-gray-200 focus:border-[#000080]"
                                    disabled={submitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="assembly" className="text-gray-700">Assembly</Label>
                                <Input
                                    id="assembly"
                                    name="assembly"
                                    placeholder="Enter assembly"
                                    value={formData.assembly}
                                    onChange={handleChange}
                                    className="h-11 border-gray-200 focus:border-[#000080]"
                                    disabled={submitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="constituency" className="text-gray-700">Constituency</Label>
                                <Input
                                    id="constituency"
                                    name="constituency"
                                    placeholder="Enter constituency"
                                    value={formData.constituency}
                                    onChange={handleChange}
                                    className="h-11 border-gray-200 focus:border-[#000080]"
                                    disabled={submitting}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF9933]"></div>
                        <div className="w-3 h-3 rounded-full bg-white border border-gray-300"></div>
                        <div className="w-3 h-3 rounded-full bg-[#138808]"></div>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/dashboard/officers">
                            <Button type="button" variant="outline" className="border-[#000080] text-[#000080]" disabled={submitting}>
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" className="bg-[#000080] hover:bg-[#000080]/90 text-white border-0" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Create {creatingRole}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
