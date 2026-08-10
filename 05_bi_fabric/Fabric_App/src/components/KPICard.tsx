import { ReactNode, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, animate } from "framer-motion";

interface KPICardProps {
    title: string;
    value: string | number;
    formatter?: (val: number) => string;
    trend?: ReactNode;
    className?: string;
    valueClassName?: string;
}

export function KPICard({ title, value, formatter, trend, className, valueClassName }: KPICardProps) {
    const numericValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^0-9.-]+/g,""));
    const initialDisplay = formatter && typeof value === 'number' ? formatter(value) : value;
    const [display, setDisplay] = useState<string | number>(initialDisplay);
    
    const count = useMotionValue(0);

    // Update display if value prop changes
    useEffect(() => {
        if (typeof numericValue === 'number' && !isNaN(numericValue)) {
            count.set(0);
            animate(count, numericValue, {
                duration: 1.0,
                delay: 1.5, // Wait for Z-axis fly-in
                ease: "easeOut",
                onUpdate: (latest) => {
                    setDisplay(formatter ? formatter(latest) : Math.round(latest));
                }
            });
        } else {
            setDisplay(formatter && typeof value === 'number' ? formatter(value) : value);
        }
    }, [value, formatter]);

    return (
        <motion.div 
            className={cn(
                "flex flex-col justify-center items-center p-400 bg-kpi text-kpi-foreground rounded-2xl shadow-sm transition-shadow hover:shadow-lg cursor-default",
            className
        )}>
            <div className={cn("text-hero-800 font-bold mb-100 tabular-nums tracking-tight", valueClassName)}>
                {display}
            </div>
            <div className="text-300 opacity-90 text-center">
                {title}
            </div>
            {trend && (
                <div className="mt-200 text-200">
                    {trend}
                </div>
            )}
        </motion.div>
    );
}
