# AtliQ Commerce End-to-End Enterprise Data Platform

[![CI Data Pipeline & dbt Validation](https://github.com/rishabh-hanselia/CB_live_DE_Capstone_atliq_gold/actions/workflows/ci.yml/badge.svg)](https://github.com/rishabh-hanselia/CB_live_DE_Capstone_atliq_gold/actions)
![Azure Data Factory](https://img.shields.io/badge/Azure%20Data%20Factory-Ingestion-blue?logo=microsoftazure)
![Azure Databricks](https://img.shields.io/badge/Azure%20Databricks-Unity%20Catalog%20%7C%20Delta-orange?logo=databricks)
![dbt-databricks](https://img.shields.io/badge/dbt--databricks-1.12-FF694B?logo=dbt)
![Microsoft Fabric](https://img.shields.io/badge/Microsoft%20Fabric-DirectQuery-blueviolet?logo=powerbi)

An enterprise-grade, metadata-driven analytical data platform built for **AtliQ Commerce**. This platform seamlessly transitions daily retail transaction data from an operational Azure SQL Database (OLTP) into an analytical lakehouse on Azure Databricks (OLAP) using Delta Lake and Unity Catalog, with executive business intelligence delivered through Microsoft Fabric & Power BI.

---

## 🏗️ End-to-End Architecture

![End-to-End Architecture](docs/atliq_commerce_architecture.svg)

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     OPERATIONAL LAYER (OLTP)                                           │
│  Azure SQL Database (customers, orders, order_items, products, supplier_price_list, etl.control_table) │
└──────────────────────────────────────────────────┬─────────────────────────────────────────────────────┘
│
│ Incremental Batch Extract (WHERE updated_at > last_loaded_at)
▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     INGESTION & STAGING (BRONZE)                                       │
│  Azure Data Factory (ADF) Master Pipeline ──> ADLS Gen2 (Raw JSON/Parquet Files)                       │
└──────────────────────────────────────────────────┬─────────────────────────────────────────────────────┘
│
│ PySpark MERGE INTO (Deduplication & Schema Enforcement)
▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLEANSED LAKEHOUSE LAYER (SILVER)                                    │
│  Azure Databricks Unity Catalog ──> Delta Lake Tables (atliq.silver.*)                                 │
└──────────────────────────────────────────────────┬─────────────────────────────────────────────────────┘
│
│ dbt build & Automated Data Quality Assertions
▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   DIMENSIONAL MODELING LAYER (GOLD)                                    │
│  Star Schema Delta Lake Tables (atliq.gold.fact_sales, dim_customer, dim_product, dim_date)            │
└──────────────────────────────────────────────────┬─────────────────────────────────────────────────────┘
│
│ DirectQuery via Databricks Serverless SQL Warehouse
▼
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    BUSINESS INTELLIGENCE LAYER (BI)                                    │
│  Microsoft Fabric / Power BI Dashboard (Executive Sales Metrics & Margin Analytics)                    │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```text
.
├── .github/
│   └── workflows/
│       └── ci.yml                   # M7: GitHub Actions CI workflow (dbt compilation & quality tests)
│
├── 01_source_oltp/                  # M1: Source OLTP schema, watermarking & transaction simulator
│   ├── data_generator/
│   │   └── daily_order_simulator.py # Daily Python transaction simulator
│   ├── etl_control/
│   │   └── etl_control_table.sql    # Incremental watermarking table DDL
│   ├── oltp_schema/
│   │   └── schema_ddl.sql           # Azure SQL DDL for source tables
│   └── seed_data/                   
│       ├── insert_customers.sql     # Baseline data seed file
│       ├── insert_order_items.sql   # Baseline data seed file
│       ├── insert_orders.sql        # Baseline data seed file
│       ├── insert_payments.sql      # Baseline data seed file
│       ├── insert_products.sql      # Baseline data seed file
│       ├── load_csvs.py             # Script to load initial CSV files
│       ├── marketing_spend.csv      # Seed CSV dataset
│       └── supplier_price_list.csv  # Seed CSV dataset
│
├── 02_ingestion_adf/                # M2 & M5: Metadata-driven ADF orchestration
│   ├── pipelines/
│   │   └── pl_atliq_master_ingestion.json # Exported ADF JSON pipeline definition
│   └── triggers/
│       └── trig_nightly_schedule.png      # Nightly trigger configuration screenshot
│
├── 03_silver_databricks/            # M3: Bronze to Silver transformations
│   └── Silver_Pipeline.ipynb        # PySpark Notebook for incremental Delta MERGE INTO
│
├── 04_gold_dbt/                     # M4 & M7: Silver to Gold dbt modeling
│   ├── models/                      # Staging view definitions and Star schema models (fact_sales, dim_*)
│   ├── tests/                       # Custom generic data quality tests
│   └── dbt_project.yml              # Project configuration (dynamic target locations)
│
├── 05_bi_fabric/                    # M6: Reporting and dashboards (Directory prepared for Fabric deliverables)
│   ├── Atliq Commerce.pbix          # Power BI Dashboard file
│   ├── Atliq_Commerce_Dashboard.png # Dashboard screenshot
│   ├── Lakehouse_Fabric.png         # Fabric Lakehouse view screenshot
│   └── Semantic_Model.png           # Semantic model relationships screenshot
│
├── docs/                            # Documentation deliverables
│   ├── architecture_writeup.md      # Detailed write-up on OLTP vs OLAP & sync mechanism
│   ├── atliq_commerce_architecture.svg # End-to-End Architecture Diagram
│   ├── first_pipeline _run_output.png  # Initial pipeline run output screenshot
│   └── second_pipeline _run_output.png # Incremental pipeline run output screenshot
│
├── .gitignore                       # Python, VS Code, and dbt ignores
└── README.md                        # Platform documentation
```

---

## ⚡ Key Pipeline Capabilities

**1. Incremental Load & Idempotency**
*   **Watermark Tracking**: Ingestion is controlled via `etl.control_table` in Azure SQL. ADF extracts only records modified after `last_loaded_at` (WHERE updated_at > last_loaded_at).
*   **Idempotency Guarantee**: Pipeline execution can run back-to-back without producing duplicate records or skewing gross revenue metrics. Tested and verified in Milestone 5.

**2. Silver Delta MERGE Logic**
*   **PySpark Upserts**: The Silver layer handles updates and insertions using PySpark `MERGE INTO` operations against Delta Lake tables in `Silver_Pipeline.ipynb`, ensuring historical updates to customer or product data propagate accurately without duplicating rows.

**3. Gold Star Schema & Data Quality Gates (dbt)**
*   **Star Schema**: Transforms Silver data into an analytical Star Schema consisting of `fact_sales`, `dim_customer`, `dim_product`, and `dim_date`.
*   **Quality Gates**: Integrated data assertions (unique, not_null, and relationships foreign key constraints) execute during `dbt build`. If data tests fail, downstream reporting is safeguarded against corrupt data.

**4. CI/CD & Automated Governance (GitHub Actions)**
*   **Automated CI Validation**: On every Pull Request or push to main, GitHub Actions provisions a Python 3.11 runner, securely connects to Databricks using GitHub Secrets (`DATABRICKS_HOST`, `DATABRICKS_HTTP_PATH`, `DATABRICKS_TOKEN`), and executes `dbt build --target ci`.
*   **Isolated CI Testing**: Builds models and executes data assertions inside an isolated `atliq.ci` schema, preventing test runs from modifying production tables in `atliq.gold`.

---

## 🛠️ Tech Stack

*   **Database (OLTP)**: Azure SQL Database
*   **Orchestration**: Azure Data Factory (ADF)
*   **Compute & Storage**: Azure Databricks (Serverless SQL Warehouses & Unity Catalog), Delta Lake, ADLS Gen2
*   **Transformation**: PySpark, dbt (dbt-databricks v1.12)
*   **CI/CD**: GitHub Actions
*   **Visualization**: Microsoft Fabric / Power BI (DirectQuery mode)

---

## 📊 Analytics & Reporting

The Microsoft Fabric / Power BI dashboard leverages a **OneLake shortcut** in a Fabric Lakehouse pointing directly to the ADLS Gen2 path where the Gold layer (`atliq.gold`) is stored as external Delta tables (zero data copy). It answers key executive questions:
*   **Revenue Trend**: `gross_revenue` tracked by month and quarter (via `dim_date`).
*   **Top Products**: `gross_revenue` sliced by product and category (via `dim_product`).
*   **Top Cities**: `gross_revenue` distributed by customer city (via `dim_customer`).
*   **New vs Returning Customers**: Analyzes customers by signup cohort vs. order month.

---

## 📄 Documentation Deliverables

*   **OLTP Source & Simulator**: Found in [`01_source_oltp/`](01_source_oltp/), including schema, seed data, control table, and Python simulator.
*   **ADF Ingestion Pipeline**: Exported JSON definition at [`02_ingestion_adf/pipelines/pl_atliq_master_ingestion.json`](02_ingestion_adf/pipelines/pl_atliq_master_ingestion.json).
*   **Databricks Silver & Gold Transformations**: PySpark merge notebook in [`03_silver_databricks/`](03_silver_databricks/) and dbt project with tests in [`04_gold_dbt/`](04_gold_dbt/).
*   **Nightly Trigger Schedule**: Screenshot of ADF schedule at [`02_ingestion_adf/triggers/trig_nightly_schedule.png`](02_ingestion_adf/triggers/trig_nightly_schedule.png).
*   **Fabric Dashboard**: Power BI file and screenshots located in [`05_bi_fabric/`](05_bi_fabric/).
*   **Architecture & Sync Write-Up**: Detailed explanation available at [`docs/architecture_writeup.md`](docs/architecture_writeup.md).
