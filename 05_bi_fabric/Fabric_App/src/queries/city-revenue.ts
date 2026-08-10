import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./city-revenue.dax?raw";
import spec from "./city-revenue.json";

const connection = "atliq_commerce";

const columnMetadata: ColumnMetadataMap = {
  "dim_customer[city]": { name: "dim_customercity", displayName: "City" },
  "[Gross Revenue]": { name: "Gross Revenue", displayName: "Gross Revenue", format: "₹#,0.00" },
};

interface FilterParams {
  year?: string;
  month?: string;
  category?: string;
}

export function cityRevenue(params: FilterParams = {}) {
  let query = baseQuery;
  const filters: string[] = [];
  let vegaLiteSpec = spec as VisualizationSpec;

  if (params.year) filters.push(`TREATAS({${params.year}}, 'dim_date'[year])`);
  if (params.month) filters.push(`TREATAS({"${params.month}"}, 'dim_date'[month_name])`);
  if (params.category && params.category !== "All") filters.push(`TREATAS({"${params.category}"}, 'dim_product'[category])`);

  if (filters.length > 0) {
    query = baseQuery.replace('"Gross Revenue"', `${filters.join(', ')}, "Gross Revenue"`);
  }

  return { connection, query, columnMetadata, vegaLiteSpec };
}
