import { Outlet, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export const RootLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full bg-[#000080]"></div>
                                </div>
                            </div>
                        </div>
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
                        <div className="w-6 h-6 rounded-full bg-[#FF9933] flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-[#000080]"></div>
                            </div>
                        </div>
                        <span className="font-semibold">One Nation One Election</span>
                    </div>

                </div>
            </footer>
        </div>
    )
}
