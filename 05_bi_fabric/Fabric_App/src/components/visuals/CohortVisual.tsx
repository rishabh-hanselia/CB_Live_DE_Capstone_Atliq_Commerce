import { useSemanticModelQuery } from "@/hooks/use-semantic-model-query";
import { cohort } from "@/queries/cohort";
import { toDataTable } from "@/lib/to-data-table";
import { VegaVisual, useCssTheme } from "@microsoft/fabric-visuals";

export function CohortVisual({ year, month, category }: { year?: string; month?: string; category?: string }) {
    const theme = useCssTheme();
    const filterParams = { year, month, category };
    const { data, isLoading } = useSemanticModelQuery(cohort(filterParams));

    if (isLoading) return <div className="animate-pulse h-full bg-muted rounded-2xl w-full"></div>;
    if (data?.status === "success") {
        const spec = cohort(filterParams).vegaLiteSpec;
        if (spec) {
            spec.width = "container";
            spec.height = "container";
            spec.autosize = { type: "fit", contains: "padding" };
        }
        return (
            <VegaVisual 
                spec={spec} 
                data={toDataTable(data.table, cohort().columnMetadata)} 
                theme={theme} 
            />
        );
    }
    return null;
}
