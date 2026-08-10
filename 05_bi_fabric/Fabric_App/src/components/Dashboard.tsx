import { useState, useRef, useContext } from "react";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ThemeContext } from "@/hooks/theme.context";
import { KPIsVisual } from "./visuals/KPIsVisual";
import { RevenueTrendVisual } from "./visuals/RevenueTrendVisual";
import { TopProductsVisual } from "./visuals/TopProductsVisual";
import { CategoryTableVisual } from "./visuals/CategoryTableVisual";
import { CityRevenueVisual } from "./visuals/CityRevenueVisual";

export function Dashboard() {
    // Global Slicer State
    const [selectedYear, setSelectedYear] = useState<string | undefined>("2026");
    const [selectedMonth, setSelectedMonth] = useState<string | undefined>("January");
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>("All");

    const categoryRef = useRef<HTMLDivElement>(null);
    const monthRef = useRef<HTMLDivElement>(null);

    const scroll = (ref: React.RefObject<HTMLDivElement>, direction: "left" | "right") => {
        if (ref.current) {
            const amount = direction === "left" ? -200 : 200;
            ref.current.scrollBy({ left: amount, behavior: "smooth" });
        }
    };

    const filterParams = { year: selectedYear, month: selectedMonth, category: selectedCategory };
    const themeContext = useContext(ThemeContext);
    const isDark = themeContext?.isDark ?? false;
    const toggleTheme = themeContext?.toggleTheme ?? (() => {});

    // 3D Header interaction
    const dragX = useMotionValue(0);
    const dragY = useMotionValue(0);
    const rotateX = useTransform(dragY, [-100, 100], [30, -30]);
    const rotateY = useTransform(dragX, [-100, 100], [-30, 30]);

    // Fly-in animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.5, z: -1000 },
        show: { opacity: 1, scale: 1, z: 0, transition: { type: "spring", bounce: 0.3, duration: 1.5 } }
    };

    return (
        <div className="min-h-screen bg-background p-600 font-sans text-foreground overflow-hidden perspective-1000">
            <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                animate="show" 
                className="max-w-[1600px] mx-auto flex flex-col gap-600 transform-style-3d"
            >
                
                {/* Header */}
                <motion.header variants={itemVariants} className="flex items-center bg-card p-400 rounded-3xl shadow-sm border border-border">
                    <motion.div 
                        className="flex items-center gap-300 cursor-grab active:cursor-grabbing p-200 mr-800 shrink-0"
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.5}
                        style={{ x: dragX, y: dragY, rotateX, rotateY }}
                        whileHover={{ rotateY: 360, transition: { duration: 2, repeat: Infinity, ease: "linear" } }}
                    >
                        {/* Logo */}
                        <div className="w-12 h-12 flex items-center justify-center">
                            <img src="/logo.png" alt="Atliq Logo" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-600 font-bold tracking-tight select-none">ATLIQ COMMERCE</h1>
                    </motion.div>
                    
                    {/* Filters */}
                    <div className="flex gap-400 items-center flex-1 justify-end">
                        {/* Category Slicer */}
                        <div className="flex items-center gap-100">
                            <button onClick={() => scroll(categoryRef, "left")} className="p-100 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"><ChevronLeft size={20}/></button>
                            <div ref={categoryRef} className="flex bg-muted rounded-full p-100 px-300 gap-200 text-300 font-medium items-center shadow-inner overflow-x-auto no-scrollbar whitespace-nowrap mask-edges max-w-[250px]">
                                {["All", "Electronics", "Fashion", "Home Appliances", "Books"].map(c => (
                                    <button 
                                        key={c}
                                        onClick={() => setSelectedCategory(prev => prev === c ? undefined : c)}
                                        className={`px-300 py-100 rounded-full transition-all shrink-0 ${selectedCategory === c ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-background hover:shadow-sm text-muted-foreground"}`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => scroll(categoryRef, "right")} className="p-100 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"><ChevronRight size={20}/></button>
                        </div>
                        
                        {/* Month Slicer */}
                        <div className="flex items-center gap-100">
                            <button onClick={() => scroll(monthRef, "left")} className="p-100 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"><ChevronLeft size={20}/></button>
                            <div ref={monthRef} className="flex bg-muted rounded-full p-100 px-300 gap-200 text-300 font-medium items-center shadow-inner overflow-x-auto no-scrollbar whitespace-nowrap mask-edges max-w-[250px]">
                                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                                    <button 
                                        key={m}
                                        onClick={() => setSelectedMonth(prev => prev === m ? undefined : m)}
                                        className={`px-300 py-100 rounded-full transition-all shrink-0 ${selectedMonth === m ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-background hover:shadow-sm text-muted-foreground"}`}
                                    >
                                        {m.substring(0, 3)}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => scroll(monthRef, "right")} className="p-100 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"><ChevronRight size={20}/></button>
                        </div>

                        {/* Year Slicer */}
                        <div className="flex bg-muted rounded-full p-100 text-300 font-medium items-center shadow-inner shrink-0">
                            {["2024", "2025", "2026"].map(y => (
                                <button 
                                    key={y}
                                    onClick={() => setSelectedYear(prev => prev === y ? undefined : y)}
                                    className={`px-400 py-100 rounded-full transition-all ${selectedYear === y ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-background hover:shadow-sm text-muted-foreground"}`}
                                >
                                    {y}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Theme Toggle */}
                    <div className="ml-800 flex items-center shrink-0">
                        <button 
                            onClick={toggleTheme}
                            className="p-300 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
                        >
                            {isDark ? <Moon size={22} className="text-blue-400" /> : <Sun size={22} className="text-amber-500" />}
                        </button>
                    </div>
                </motion.header>

                {/* Top Section */}
                <div className="grid grid-cols-[1fr_1.5fr] gap-600">
                    <motion.div variants={itemVariants} className="h-[400px]">
                        <KPIsVisual {...filterParams} />
                    </motion.div>
                    <motion.div variants={itemVariants} className="bg-card p-500 rounded-3xl shadow-sm border border-border flex flex-col h-[400px] animate-chart-on-load hover:shadow-lg transition-shadow">
                        <h2 className="text-400 font-semibold mb-400">Revenue Trend</h2>
                        <div className="flex-1 min-h-0 relative">
                            <div className="absolute inset-0">
                                <RevenueTrendVisual {...filterParams} />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-600">
                    {/* Table */}
                    <motion.div variants={itemVariants} className="bg-card p-500 rounded-3xl shadow-sm border border-border flex flex-col h-[350px] animate-table-on-load hover:shadow-lg transition-shadow">
                        <h2 className="text-400 font-semibold mb-400">Category & Product Revenue</h2>
                        <div className="flex-1 min-h-0 overflow-auto">
                            <CategoryTableVisual {...filterParams} />
                        </div>
                    </motion.div>

                    {/* Top Products */}
                    <motion.div variants={itemVariants} className="bg-card p-500 rounded-3xl shadow-sm border border-border flex flex-col h-[350px] animate-chart-on-load hover:shadow-lg transition-shadow">
                        <h2 className="text-400 font-semibold mb-400">Top 5 Products</h2>
                        <div className="flex-1 min-h-0 relative">
                            <div className="absolute inset-0">
                                <TopProductsVisual {...filterParams} />
                            </div>
                        </div>
                    </motion.div>

                    {/* City Revenue */}
                    <motion.div variants={itemVariants} className="bg-card p-500 rounded-3xl shadow-sm border border-border flex flex-col h-[350px] animate-chart-on-load hover:shadow-lg transition-shadow">
                        <h2 className="text-400 font-semibold mb-400">Gross Revenue by City</h2>
                        <div className="flex-1 min-h-0 relative">
                            <div className="absolute inset-0">
                                <CityRevenueVisual {...filterParams} />
                            </div>
                        </div>
                    </motion.div>
                </div>

            </motion.div>
        </div>
    );
}
