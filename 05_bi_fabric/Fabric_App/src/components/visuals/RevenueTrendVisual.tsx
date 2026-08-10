import { useSemanticModelQuery } from "@/hooks/use-semantic-model-query";
import { revenueTrend } from "@/queries/revenue-trend";
import { toDataTable } from "@/lib/to-data-table";
import { VegaVisual, useCssTheme } from "@microsoft/fabric-visuals";

export function RevenueTrendVisual({ year, month, category }: { year?: string; month?: string; category?: string }) {
    const theme = useCssTheme();
    const filterParams = { year, month, category };
    const { data, isLoading } = useSemanticModelQuery(revenueTrend(filterParams));

    if (isLoading) return <div className="animate-pulse h-full bg-muted rounded-2xl w-full"></div>;
    if (data?.status === "success") {
        const spec = revenueTrend(filterParams).vegaLiteSpec;
        if (spec) {
            // Force width and height to fit container
            spec.width = "container";
            spec.height = "container";
            spec.autosize = { type: "fit", contains: "padding" };
        }
        return (
            <VegaVisual 
                spec={spec} 
                data={toDataTable(data.table, revenueTrend().columnMetadata)} 
                theme={theme} 
            />
        );
    }
    return null;
}
