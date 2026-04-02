import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Eye, EyeOff, Loader2, Mail, Lock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginOfficer } from "@/api/officer.api"

const ROLES = [
    { value: "BLO", label: "Booth Level Officer (BLO)" },
    { value: "ERO", label: "Electoral Registration Officer (ERO)" },
    { value: "DEO", label: "District Election Officer (DEO)" },
    { value: "CEO", label: "Chief Election Officer (CEO)" },
    { value: "ECI HQ", label: "Election Commission India HQ" },
]

export const Login = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: ""
    })
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.email) {
            newErrors.email = "Email address is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }
        if (!formData.password) {
            newErrors.password = "Password is required"
        }
        if (!formData.role) {
            newErrors.role = "Please select your designation"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)
        try {
            const response = await loginOfficer(formData)
            const officer = response.data
            toast.success("Login successful! Redirecting...", {
                style: {
                    background: '#fff',
                    color: '#000080',
                    border: '2px solid #138808',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 10px 40px rgba(19, 136, 8, 0.2)',
                },
                iconTheme: {
                    primary: '#138808',
                    secondary: '#fff',
                },
            })
            localStorage.setItem("officer", JSON.stringify(officer))
            
            const rolePath = officer.role.toLowerCase().replace(" ", "-")
            setTimeout(() => navigate(`/dashboard/${rolePath}`), 800)
        } catch (error) {
            toast.error(error.message || "Invalid credentials. Please try again.", {
                style: {
                    background: '#fff',
                    color: '#000080',
                    border: '2px solid #FF9933',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 10px 40px rgba(255, 153, 51, 0.2)',
                },
                iconTheme: {
                    primary: '#FF9933',
                    secondary: '#fff',
                },
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your official email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/20 rounded-lg transition-all ${errors.email ? "border-red-500 bg-red-50" : ""}`}
                        disabled={loading}
                    />
                </div>
                {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`pl-10 pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/20 rounded-lg transition-all ${errors.password ? "border-red-500 bg-red-50" : ""}`}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#000080] transition-colors"
                        disabled={loading}
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-700 font-medium">Select Designation</Label>
                <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 h-12 bg-gray-50 border border-gray-200 rounded-lg transition-all focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/20 appearance-none cursor-pointer text-gray-700 ${errors.role ? "border-red-500 bg-red-50" : ""}`}
                        disabled={loading}
                    >
                        <option value="">Select your designation</option>
                        {ROLES.map((role) => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.role && (
                    <p className="text-sm text-red-500 mt-1">{errors.role}</p>
                )}
            </div>

            <div className="pt-2">
                <Button
                    type="submit"
                    className="w-full h-12 bg-[#000080] hover:bg-[#000080]/90 text-white font-semibold rounded-lg shadow-lg shadow-[#000080]/20 transition-all"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Authenticating...
                        </>
                    ) : (
                        "Sign In to Dashboard"
                    )}
                </Button>
            </div>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-gray-500">
                        Secured by ONOE System
                    </span>
                </div>
            </div>

            <p className="text-center text-sm text-gray-600">
                Authorized Personnel Only
            </p>
        </form>
    )
}

const ChevronDown = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={className}
    >
        <path d="m6 9 6 6 6-6"/>
    </svg>
)
