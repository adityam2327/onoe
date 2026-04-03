import { Outlet, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export const RootLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <img 
                            src="/eci-logo.png" 
                            alt="ECI Logo" 
                            className="w-10 h-10 object-contain"
                        />
                        <span className="text-xl font-bold text-[#000080]">ONOE</span>
                    </div>
                    <nav className="flex items-center gap-4">
                        <Link to="/login">
                            <Button className="bg-[#000080] hover:bg-[#000080]/90 text-white">
                                Login
                            </Button>
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-[#000080] text-white py-6">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <img 
                            src="/eci-logo.png" 
                            alt="ECI Logo" 
                            className="w-8 h-8 object-contain"
                        />
                        <span className="font-semibold">One Nation One Election - Election Commission of India</span>
                    </div>

                </div>
            </footer>
        </div>
    )
}
