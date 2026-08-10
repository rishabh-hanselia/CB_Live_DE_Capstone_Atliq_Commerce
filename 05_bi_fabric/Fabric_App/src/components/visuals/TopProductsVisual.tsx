import { useSemanticModelQuery } from "@/hooks/use-semantic-model-query";
import { topProducts } from "@/queries/top-products";
import { toDataTable } from "@/lib/to-data-table";
import { VegaVisual, useCssTheme } from "@microsoft/fabric-visuals";

export function TopProductsVisual({ year, month, category }: { year?: string; month?: string; category?: string }) {
    const theme = useCssTheme();
    const filterParams = { year, month, category };
    const { data, isLoading } = useSemanticModelQuery(topProducts(filterParams));

    if (isLoading) return <div className="animate-pulse h-full bg-muted rounded-2xl w-full"></div>;
    if (data?.status === "success") {
        const spec = topProducts(filterParams).vegaLiteSpec;
        if (spec) {
            spec.width = "container";
            spec.height = "container";
            spec.autosize = { type: "fit", contains: "padding" };
        }
        return (
            <VegaVisual 
                spec={spec} 
                data={toDataTable(data.table, topProducts().columnMetadata)} 
                theme={theme} 
            />
        );
    }
    return null;
}
