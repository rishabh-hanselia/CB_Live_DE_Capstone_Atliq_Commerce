import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./revenue-trend.dax?raw";
import spec from "./revenue-trend.json";

const connection = "atliq_commerce";

const columnMetadata: ColumnMetadataMap = {
  "dim_date[year_month]": { name: "dim_dateyear_month", displayName: "Year Month" },
  "[Gross Revenue]": { name: "Gross Revenue", displayName: "Gross Revenue", format: "₹#,0.00" },
};

interface FilterParams {
  year?: string;
  month?: string;
  category?: string;
}

export function revenueTrend(params: FilterParams = {}) {
  let query = baseQuery;
  const filters: string[] = [];
  let vegaLiteSpec = spec as VisualizationSpec;

  if (params.year) {
    filters.push(`TREATAS({${params.year}}, 'dim_date'[year])`);
  }
  // Omitting month filter for revenue trend so we can see the full year trend
  if (params.category && params.category !== "All") {
    filters.push(`TREATAS({"${params.category}"}, 'dim_product'[category])`);
  }

  if (filters.length > 0) {
    query = baseQuery.replace('"Gross Revenue"', `${filters.join(', ')}, "Gross Revenue"`);
  }

  return { connection, query, columnMetadata, vegaLiteSpec };
}
