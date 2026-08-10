import { useSemanticModelQuery } from "@/hooks/use-semantic-model-query";
import { kpis } from "@/queries/kpis";
import { toDataTable } from "@/lib/to-data-table";
import { KPICard } from "../KPICard";

const formatCurrency = (val: number) => "₹" + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(val);
const formatNumber = (val: number) => new Intl.NumberFormat('en-IN').format(val);
const formatPercent = (val: number) => new Intl.NumberFormat('en-IN', { style: 'percent', maximumFractionDigits: 2 }).format(val);

export function KPIsVisual({ year, month, category }: { year?: string; month?: string; category?: string }) {
    const filterParams = { year, month, category };
    const { data, isLoading } = useSemanticModelQuery(kpis(filterParams));

    if (isLoading) return <div className="animate-pulse h-full bg-muted rounded-2xl w-full"></div>;
    if (data?.status === "success") {
        const table = toDataTable(data.table, kpis().columnMetadata);
        const row = table.rows[0] as any[];
        return (
            <div className="grid grid-cols-2 gap-400 h-full">
                <div className="flex flex-col gap-400">
                    <KPICard title="Total Customers" value={row[0]} formatter={formatNumber} className="flex-1" />
                    <KPICard title="Returning Customers" value={row[1]} formatter={formatNumber} className="flex-1" />
                    <KPICard title="Gross Revenue" value={row[2]} formatter={formatCurrency} className="flex-1" />
                </div>
                <div className="flex flex-col gap-400">
                    <KPICard title="New Customers" value={row[3] || 0} formatter={formatNumber} className="flex-1" />
                    <KPICard title="Returning Customer %" value={row[4]} formatter={formatPercent} className="flex-1" />
                    <KPICard title="Top 5 Products Revenue" value={row[5]} formatter={formatCurrency} className="flex-1" />
                </div>
            </div>
        );
    }
    return <div>Error loading KPIs</div>;
}
