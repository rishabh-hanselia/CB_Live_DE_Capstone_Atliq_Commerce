import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./cohort.dax?raw";
import spec from "./cohort.json";

const connection = "atliq_commerce";

const columnMetadata: ColumnMetadataMap = {
  "dim_customer[signup_cohort]": { name: "dim_customersignup_cohort", displayName: "Signup Cohort" },
  "dim_date[year_month]": { name: "dim_dateyear_month", displayName: "Year Month" },
  "[Total Customers]": { name: "Total Customers", displayName: "Total Customers", format: "#,0" },
};

interface FilterParams {
  year?: string;
  month?: string;
  category?: string;
}

export function cohort(params: FilterParams = {}) {
  let query = baseQuery;
  const filters: string[] = [];
  let vegaLiteSpec = spec as VisualizationSpec;

  // Cohort typically ignores month filter for the same reason as trend, but let's apply it if selected, or maybe just year
  if (params.year) filters.push(`TREATAS({${params.year}}, 'dim_date'[year])`);
  if (params.category && params.category !== "All") filters.push(`TREATAS({"${params.category}"}, 'dim_product'[category])`);

  if (filters.length > 0) {
    query = baseQuery.replace('"Total Customers"', `${filters.join(', ')}, "Total Customers"`);
  }

  return { connection, query, columnMetadata, vegaLiteSpec };
}
