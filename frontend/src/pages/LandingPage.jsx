import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
    {
        title: "Unified Electoral Process",
        description: "Streamline elections across the nation into a single, efficient process saving time and resources.",
        icon: "🏛️"
    },
    {
        title: "Cost Effective",
        description: "Reduce the massive expenditure incurred in conducting multiple elections across states.",
        icon: "💰"
    },
    {
        title: "Enhanced Governance",
        description: "Enable governments to focus on development work rather than frequent election cycles.",
        icon: "📈"
    },
    {
        title: "Reduced Voter Fatigue",
        description: "Minimize voter exhaustion from frequent polling and increase voter participation.",
        icon: "🗳️"
    },
    {
        title: "Unified National Development",
        description: "Promote cohesive policy implementation across all states for holistic growth.",
        icon: "🌐"
    },
    {
        title: "Strengthened Democracy",
        description: "Foster greater stability in the democratic system with synchronized elections.",
        icon: "⚖️"
    }
]

const problemCards = [
    {
        title: "Voter Migration Data",
        description: "Large-scale voter migration between constituencies creates duplicate entries and electoral inconsistencies across state boundaries.",
        image: "/migration_data_1.png",
        image2: "/migration_data_2.png",
        badge: "Voter Mobility",
        color: "#000080",
        data: {
            "Total Voters Analyzed": "15,42,83,657",
            "Unique Voters": "12,87,45,230",
            "Duplicate Entries Found": "2,55,38,427",
            "Inter-State Migration": "18 States",
            "Top Migrating States": "Maharashtra, Delhi, Gujarat",
            "Migration Rate": "16.5%"
        }
    },
    {
        title: "Duplicate Voter Records",
        description: "Same voters registered in multiple constituencies due to migration, leading to potential electoral fraud and unfair representation.",
        image: "/duplicate_data_1.png",
        image2: "/duplicate_data_2.png",
        badge: "Voter Unification",
        color: "#FF9933",
        data: {
            "Duplicate Records Detected": "2,55,38,427",
            "Double Booked Voters": "18,47,562",
            "Triple Booked Voters": "3,245",
            "States Affected": "All 28 States",
            "Highest Duplication Rate": "Tamil Nadu (8.2%)",
            "Resolved Records": "1,87,45,000"
        }
    }
]

const ImageModal = ({ isOpen, onClose, image, title, data }) => {
    if (!isOpen) return null

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h3 className="text-xl font-bold text-[#000080]">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="mb-6 rounded-xl overflow-hidden border-2 border-slate-200">
                        <img 
                            src={image} 
                            alt={title}
                            className="w-full h-auto object-contain"
                        />
                    </div>
                    
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6">
                        <h4 className="text-lg font-bold text-[#000080] mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#FF9933]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z"/>
                            </svg>
                            Key Data Insights
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(data).map(([key, value], idx) => (
                                <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                                    <div className="text-2xl font-bold text-[#000080]">{value}</div>
                                    <div className="text-sm text-muted-foreground mt-1">{key}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const LandingPage = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedTitle, setSelectedTitle] = useState("")
    const [selectedData, setSelectedData] = useState({})

    const openModal = (image, title, data) => {
        setSelectedImage(image)
        setSelectedTitle(title)
        setSelectedData(data)
        setModalOpen(true)
    }

    return (
        <div className="flex flex-col min-h-screen">
            <section className="relative w-full py-20 lg:py-28 bg-gradient-to-b from-[#000080] via-[#000080] to-[#FF9933]/20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDgwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-8">
                        <div className="flex items-center gap-6 mb-6">
                            <img 
                                src="/eci-logo.png" 
                                alt="ECI Logo" 
                                className="w-28 h-28 object-contain drop-shadow-2xl"
                            />
                            <div className="hidden sm:block w-px h-20 bg-white/30"></div>
                            <div className="hidden sm:flex flex-col">
                                <span className="text-white/80 text-sm font-medium">Powered by</span>
                                <span className="text-white text-xl font-bold tracking-wide">Election Commission of India</span>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                                One Nation, One Election
                            </h1>
                            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                                A transformative initiative to synchronize state and national elections, 
                                building a unified and efficient democratic framework for India.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-6 py-4">
                            <div className="w-16 h-3 bg-[#FF9933] rounded-full shadow-lg"></div>
                            <div className="w-16 h-3 bg-white rounded-full shadow-lg"></div>
                            <div className="w-16 h-3 bg-[#138808] rounded-full shadow-lg"></div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                            <Link to="/login">
                                <Button size="lg" className="bg-[#FF9933] hover:bg-[#FF9933]/90 text-white font-semibold px-8">
                                    Get Started
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="border-white text-[#000080] hover:bg-white hover:text-[#000080]">
                                Learn More
                            </Button>
                        </div>
                    </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
            </section>

            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#000080] mb-4">
                            Why One Nation One Election?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            A comprehensive solution to transform India's electoral landscape 
                            for better governance and national unity.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <Card key={index} className="border-t-4 border-t-[#FF9933] hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="text-4xl mb-2">{feature.icon}</div>
                                    <CardTitle className="text-[#000080]">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold mb-4">
                            The Challenge We Solve
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#000080] mb-4">
                            Addressing Voter Mobility & Unification
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our platform tackles the critical challenges of voter migration across states 
                            and duplicate voter records that threaten electoral integrity.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {problemCards.map((card, index) => (
                            <div 
                                key={index}
                                className="relative group"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#000080] to-[#FF9933] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                                    <div 
                                        className="h-2"
                                        style={{ backgroundColor: card.color }}
                                    ></div>
                                    <div className="p-6 lg:p-8">
                                        <span 
                                            className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-4"
                                            style={{ backgroundColor: card.color }}
                                        >
                                            {card.badge}
                                        </span>
                                        <h3 className="text-2xl font-bold text-[#000080] mb-4">
                                            {card.title}
                                        </h3>
                                        <p className="text-muted-foreground mb-6">
                                            {card.description}
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div 
                                                className="relative overflow-hidden rounded-xl border-2 border-slate-200 hover:border-[#FF9933] transition-all duration-300 group/img cursor-pointer"
                                                onClick={() => openModal(card.image, card.title, card.data)}
                                            >
                                                <img 
                                                    src={card.image} 
                                                    alt={`${card.title} visualization 1`}
                                                    className="w-full h-40 object-cover transform group-hover/img:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                                    <span className="text-white text-xs font-medium flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                        </svg>
                                                        Click to view data
                                                    </span>
                                                </div>
                                            </div>
                                            <div 
                                                className="relative overflow-hidden rounded-xl border-2 border-slate-200 hover:border-[#138808] transition-all duration-300 group/img cursor-pointer"
                                                onClick={() => openModal(card.image2, card.title, card.data)}
                                            >
                                                <img 
                                                    src={card.image2} 
                                                    alt={`${card.title} visualization 2`}
                                                    className="w-full h-40 object-cover transform group-hover/img:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                                    <span className="text-white text-xs font-medium flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                        </svg>
                                                        Click to view data
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 p-8 bg-gradient-to-r from-[#000080] via-[#FF9933] to-[#138808] rounded-2xl text-center text-white">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            Our Solution: Unified Voter Management
                        </h3>
                        <p className="text-lg text-white/90 max-w-3xl mx-auto mb-6">
                            By synchronizing elections and implementing intelligent voter verification systems, 
                            we eliminate duplicate entries, track migration patterns, and ensure every eligible 
                            voter has exactly one verified registration across the nation.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                <span className="w-3 h-3 bg-[#138808] rounded-full"></span>
                                <span className="font-medium">Deduplication</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                <span className="w-3 h-3 bg-[#FF9933] rounded-full"></span>
                                <span className="font-medium">Migration Tracking</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                <span className="w-3 h-3 bg-white rounded-full"></span>
                                <span className="font-medium">Unified Registry</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-r from-[#000080] via-[#FF9933] to-[#138808]">
                <div className="container mx-auto px-4 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Building a United Future
                    </h2>
                    <p className="text-xl max-w-3xl mx-auto mb-8 text-white/90">
                        Join the movement towards a more efficient, cost-effective, and unified 
                        democratic system that serves all Indians.
                    </p>
                    <Link to="/login">
                        <Button size="lg" className="bg-white text-[#000080] hover:bg-white/90 font-semibold">
                            Join Now
                        </Button>
                    </Link>
                </div>
            </section>

            <section className="py-16 bg-card">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-[#FF9933] mb-2">50+</div>
                            <div className="text-muted-foreground">States & UTs</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-[#000080] mb-2">900M+</div>
                            <div className="text-muted-foreground">Eligible Voters</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-[#138808] mb-2">1M+</div>
                            <div className="text-muted-foreground">Polling Stations</div>
                        </div>
                    </div>
                </div>
            </section>

            <ImageModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                image={selectedImage}
                title={selectedTitle}
                data={selectedData}
            />
        </div>
    )
}
