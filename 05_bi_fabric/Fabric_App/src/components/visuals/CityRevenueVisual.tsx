import { useSemanticModelQuery } from "@/hooks/use-semantic-model-query";
import { cityRevenue } from "@/queries/city-revenue";
import { toDataTable } from "@/lib/to-data-table";
import { VegaVisual, useCssTheme } from "@microsoft/fabric-visuals";

export function CityRevenueVisual({ year, month, category }: { year?: string; month?: string; category?: string }) {
    const theme = useCssTheme();
    const filterParams = { year, month, category };
    const { data, isLoading } = useSemanticModelQuery(cityRevenue(filterParams));

    if (isLoading) return <div className="animate-pulse h-full bg-muted rounded-2xl w-full"></div>;
    if (data?.status === "success") {
        const spec = cityRevenue(filterParams).vegaLiteSpec;
        if (spec) {
            spec.width = "container";
            spec.height = "container";
            spec.autosize = { type: "fit", contains: "padding" };
        }
        return (
            <VegaVisual 
                spec={spec} 
                data={toDataTable(data.table, cityRevenue().columnMetadata)} 
                theme={theme} 
            />
        );
    }
    return null;
}
