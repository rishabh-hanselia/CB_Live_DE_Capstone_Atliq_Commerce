# AtliQ Data Platform: System Architecture & Data Sync

## 1. Overview
This document outlines the architectural design and incremental synchronization strategy for the AtliQ Commerce end-to-end data platform. The platform moves operational transactional data from an Azure SQL Database (OLTP) to an analytical lakehouse environment on Azure Databricks (OLAP) and delivers executive business metrics through Microsoft Fabric / Power BI.

---

## 2. Architecture: OLTP vs. OLAP Split

### Operational Layer — OLTP (Azure SQL Database)
* **Purpose**: Serves as the transactional backend for AtliQ Commerce operations (store checkout systems, order management, inventory updates).
* **Key Characteristics**:
  * **Optimized for Writes**: High-throughput row-level `INSERT` and `UPDATE` queries with minimal write latency.
  * **Normalized Design**: Minimizes data redundancy across entities (`customers`, `orders`, `order_items`, `products`, `supplier_price_list`).
  * **Indexing & Integrity**: Enforces strict transactional integrity, primary keys, and foreign keys to prevent corrupt store data.
* **Why split?**: Running complex, long-running analytical queries (e.g., historical revenue aggregation across millions of rows) directly against Azure SQL would lock tables, degrade store checkout performance, and risk service degradation during peak business hours.

### Analytical Layer — OLAP (Azure Databricks Unity Catalog & Delta Lake)
* **Purpose**: Provides a high-performance, centralized data warehouse for business intelligence, executive reporting, and cross-functional analytics.
* **Key Characteristics**:
  * **Optimized for Reads & Aggregations**: Uses Parquet/Delta columnar storage, enabling fast scan speeds for large-scale analytical queries.
  * **Dimensional Modeling**: Organizes data into a Star Schema (`dim_customer`, `dim_product`, `dim_date`, `fact_sales`) designed for fast analytical slicing and dicing.
  * **ACID Transactions on Object Storage**: Powered by Delta Lake on Azure Data Lake Storage Gen2 (ADLS), providing versioning, time-travel, and schema enforcement.

---

## 3. Nightly Batch Processing & Data Synchronization

The pipeline operates on a nightly schedule via Azure Data Factory (ADF) to ingest, transform, and model incremental daily transactions without impacting the operational source system.

```text
┌─────────────────────────┐
│ Azure SQL Database      │  (OLTP Transaction Source)
│  - etl.control_table    │
└────────────┬────────────┘
│ Incremental Copy (WHERE updated_at > last_loaded_at)
▼
┌─────────────────────────┐
│ ADF Ingestion (Bronze)  │  (Raw Staged JSON / Parquet on ADLS Gen2)
└────────────┬────────────┘
│ PySpark MERGE INTO
▼
┌─────────────────────────┐
│ Databricks (Silver)     │  (Cleaned & Deduplicated Delta Lake)
└────────────┬────────────┘
│ dbt build & Data Quality Gates
▼
┌─────────────────────────┐
│ Databricks (Gold)       │  (Star Schema: fact_sales & dim_* models)
└────────────┬────────────┘
│ DirectQuery / Databricks SQL Warehouse
▼
┌─────────────────────────┐
│ Microsoft Fabric / PBI  │  (Executive Business Dashboard)
└─────────────────────────┘
```

### Execution Steps:

1. **Incremental Extraction & Watermarking (Bronze Layer)**:
   * ADF queries `etl.control_table` in Azure SQL to retrieve the timestamp of the last successful load (`last_loaded_at`).
   * ADF extracts only new or updated sales records (`WHERE updated_at > last_loaded_at`) into the ADLS Gen2 Bronze container.
   * Upon successful ingestion, ADF updates `last_loaded_at` in `etl.control_table` to guarantee pipeline **idempotency**.

2. **Silver Layer Processing (Databricks PySpark)**:
   * PySpark reads the incremental Bronze payload, applies schema enforcement, normalizes data types, and deduplicates records.
   * Merges incremental updates into Silver Delta tables (`stg_orders`, `stg_order_items`, etc.) using PySpark `MERGE INTO` operations.

3. **Gold Layer Modeling & Quality Gates (dbt)**:
   * dbt executes transformations on top of Silver Delta tables to materialize Gold dimensional models (`dim_customer`, `dim_product`, `dim_date`, `fact_sales`).
   * **Data Quality Gates**: Automated dbt assertions (`not_null`, `unique`, and `relationships` foreign key validation) run during `dbt build`. If any constraint fails, the pipeline halts immediately, preventing faulty data from propagating downstream.

4. **BI & Reporting Layer (Microsoft Fabric & Power BI)**:
   * Microsoft Fabric connects to `atliq.gold.*` via a Databricks Serverless SQL Warehouse / DirectQuery connection.
   * Executive dashboards pull real-time sales revenue, regional trends, product performance, and supplier cost margins without copying or duplicating storage.