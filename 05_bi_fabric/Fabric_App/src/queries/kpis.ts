import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./kpis.dax?raw";

const connection = "atliq_commerce";

export const columnMetadata: ColumnMetadataMap = {
  "[Total Customers]": { name: "Total Customers", displayName: "Total Customers", format: "#,0" },
  "[Returning Customers]": { name: "Returning Customers", displayName: "Returning Customers", format: "#,0" },
  "[Gross Revenue]": { name: "Gross Revenue", displayName: "Gross Revenue", format: "₹#,0.00" },
  "[New Customers]": { name: "New Customers", displayName: "New Customers", format: "#,0" },
  "[Returning Customer %]": { name: "Returning Customer Percentage", displayName: "Returning Customer %", format: "0.00%" },
  "[Top 5 Products Revenue]": { name: "Top 5 Products Revenue", displayName: "Top 5 Products Revenue", format: "₹#,0.00" },
};

interface FilterParams {
  year?: string;
  month?: string;
  category?: string;
}

export function kpis(params: FilterParams = {}) {
  let query = baseQuery;
  const filters: string[] = [];

  if (params.year) {
    filters.push(`TREATAS({${params.year}}, 'dim_date'[year])`);
  }
  if (params.month) {
    filters.push(`TREATAS({"${params.month}"}, 'dim_date'[month_name])`);
  }
  if (params.category && params.category !== "All") {
    filters.push(`TREATAS({"${params.category}"}, 'dim_product'[category])`);
  }

  if (filters.length > 0) {
    query = `EVALUATE CALCULATETABLE( \n ${baseQuery.replace(/EVALUATE\s+/i, '')}, \n ${filters.join(', ')} )`;
  }

  return { connection, query, columnMetadata };
}
