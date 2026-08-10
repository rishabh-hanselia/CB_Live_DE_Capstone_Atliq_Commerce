import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface PortalProps {
    id: string;
    title: string;
    initialX: number;
    initialY: number;
    width?: number;
    height?: number;
    children: (filterParams: { year?: string; month?: string; category?: string }) => React.ReactNode;
}

export function Portal({ id, title, initialX, initialY, width = 500, height = 400, children }: PortalProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    // Track position to return to after closing
    const [pos, setPos] = useState({ x: initialX, y: initialY });

    const [selectedYear, setSelectedYear] = useState<string>("2026");
    const [selectedMonth, setSelectedMonth] = useState<string>("January");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const filterParams = { year: selectedYear, month: selectedMonth, category: selectedCategory };

    const handleDoubleClick = () => {
        if (!isExpanded) setIsExpanded(true);
    };

    const renderSlicers = () => (
        <div className="flex gap-200 items-center overflow-x-auto no-scrollbar mask-edges max-w-full pb-2">
            <div className="flex bg-muted/50 rounded-full p-50 px-100 gap-100 text-200 font-medium items-center shadow-inner whitespace-nowrap">
                {["All", "Electronics", "Fashion", "Home Appliances", "Books"].map(c => (
                    <button 
                        key={c}
                        onClick={() => setSelectedCategory(c)}
                        className={`px-200 py-50 rounded-full transition-all ${selectedCategory === c ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-background hover:shadow-sm text-muted-foreground"}`}
                    >
                        {c}
                    </button>
                ))}
            </div>
            <div className="flex bg-muted/50 rounded-full p-50 px-100 gap-100 text-200 font-medium items-center shadow-inner whitespace-nowrap">
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                    <button 
                        key={m}
                        onClick={() => setSelectedMonth(m)}
                        className={`px-200 py-50 rounded-full transition-all ${selectedMonth === m ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-background hover:shadow-sm text-muted-foreground"}`}
                    >
                        {m.substring(0, 3)}
                    </button>
                ))}
            </div>
            <div className="flex bg-muted/50 rounded-full p-50 text-200 font-medium items-center shadow-inner whitespace-nowrap">
                {["2024", "2025", "2026"].map(y => (
                    <button 
                        key={y}
                        onClick={() => setSelectedYear(y)}
                        className={`px-200 py-50 rounded-full transition-all ${selectedYear === y ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-background hover:shadow-sm text-muted-foreground"}`}
                    >
                        {y}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <motion.div
            drag={!isExpanded}
            dragMomentum={false}
            onDragEnd={(e, info) => {
                setPos(prev => ({ x: prev.x + info.offset.x, y: prev.y + info.offset.y }));
            }}
            onDoubleClick={handleDoubleClick}
            initial={{ x: pos.x, y: pos.y, width, height }}
            animate={{
                x: isExpanded ? 0 : pos.x,
                y: isExpanded ? 0 : pos.y,
                width: isExpanded ? "100vw" : width,
                height: isExpanded ? "100vh" : height,
                borderRadius: isExpanded ? "0px" : "1.5rem"
            }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            className={`flex flex-col bg-card overflow-hidden shadow-xl ${isExpanded ? 'fixed z-50' : 'absolute z-10 cursor-move border border-border hover:shadow-2xl'}`}
            style={{ top: 0, left: 0 }}
        >
            <div className={`flex flex-col h-full ${isExpanded ? 'p-600' : 'p-400'}`}>
                
                {/* Header */}
                {isExpanded ? (
                    <div className="flex items-center gap-400 mb-600 shrink-0">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                            className="p-300 rounded-full bg-card border border-border hover:bg-muted transition-colors shadow-sm cursor-pointer"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h2 className="text-700 font-bold tracking-tight select-none">{title}</h2>
                    </div>
                ) : (
                    <h2 className="text-400 font-semibold mb-200 select-none pointer-events-none shrink-0">{title}</h2>
                )}

                {/* Slicers */}
                {isExpanded && (
                    <div className="mb-600 max-w-4xl shrink-0" onPointerDown={(e) => e.stopPropagation()}>
                        {renderSlicers()}
                    </div>
                )}

                {/* Chart Area */}
                <div className={`flex-1 min-h-0 relative ${isExpanded ? 'bg-background rounded-3xl border border-border shadow-inner p-400' : 'pointer-events-none'}`}>
                    <div className="absolute inset-0 p-4">
                        {children(filterParams)}
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
