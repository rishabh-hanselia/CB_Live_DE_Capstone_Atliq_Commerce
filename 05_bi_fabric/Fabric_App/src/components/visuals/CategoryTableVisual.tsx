import { useSemanticModelQuery } from "@/hooks/use-semantic-model-query";
import { categoryTable } from "@/queries/category-table";
import { motion } from "framer-motion";
import { useState } from "react";

export function CategoryTableVisual({ year, month, category }: { year?: string; month?: string; category?: string }) {
    const filterParams = { year, month, category };
    const { data, isLoading } = useSemanticModelQuery(categoryTable(filterParams));

    if (isLoading) return <div className="animate-pulse h-full bg-muted rounded-2xl w-full"></div>;
    
    if (data?.status === "success") {
        const rows = data.table.rows;
        
        const rowVariants = {
            hidden: { y: 60, opacity: 0, rotateX: -20 },
            visible: (i: number) => ({
                y: 0,
                opacity: 1,
                rotateX: 0,
                transition: {
                    delay: 1.5 + (i * 0.1), // Wait for z-axis fly-in, then stagger
                    duration: 0.6,
                    type: "spring",
                    bounce: 0.4
                }
            })
        };

        const formatCurrency = (val: number) => "₹" + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(val);

        return (
            <motion.div 
                className="w-full h-full overflow-auto text-300 pr-200 no-scrollbar mask-edges-y"
            >
                <table className="w-full text-left border-collapse relative">
                    <thead className="sticky top-0 bg-card z-10 shadow-sm">
                        <tr>
                            <th className="py-200 border-b border-border font-semibold text-muted-foreground w-1/3">Category</th>
                            <th className="py-200 border-b border-border font-semibold text-muted-foreground w-1/3">Product</th>
                            <th className="py-200 border-b border-border font-semibold text-muted-foreground text-right w-1/3">Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row: any[], index: number) => (
                            <motion.tr 
                                key={index}
                                custom={index}
                                variants={rowVariants}
                                initial="hidden"
                                animate="visible"
                                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                            >
                                <td className="py-200">{row[0]}</td>
                                <td className="py-200">{row[1]}</td>
                                <td className="py-200 text-right font-medium">{formatCurrency(row[2])}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        );
    }
    return null;
}
