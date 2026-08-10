# AtliQ Commerce - Fabric Executive App

This repository folder contains the frontend **Fabric App** built for the **AtliQ Commerce** executive dashboard. This app serves as a modern, interactive business intelligence layer connected directly to the Gold dimensional models (`atliq.gold`) via a Microsoft Fabric semantic model.

## 🚀 Overview

Built using React, Vite, and the Fabric integration toolkit, this application executes real-time DAX queries against the cloud semantic model. It translates complex analytics into an easy-to-use executive portal without data duplication.

## 📊 Key Features

The app executes specialized DAX queries (located in `src/queries/`) to render interactive visuals:

*   **Executive KPIs**: High-level aggregated metrics for quick performance checks.
*   **Revenue Trend**: Time-series visualization of gross revenue by month and quarter.
*   **Top Products**: Interactive chart slicing gross revenue by product category and item.
*   **Top Cities**: Geographical distribution of sales revenue across customer cities.
*   **Customer Cohorts**: Analysis of new versus returning customers based on signup dates versus order dates.

## 🛠️ Tech Stack

*   **Framework**: React 18, TypeScript, Vite
*   **UI Components**: Custom Fabric-styled components
*   **Data Access**: Microsoft Fabric Semantic Model Data API, Rayfin DAX executing client
*   **Styling**: CSS Modules / Global CSS

## 💻 Local Development

### Prerequisites

1.  **Node.js (v22+)**: Ensure you have Node installed.
2.  **Azure CLI**: Ensure you are authenticated via `az login` to allow the app to query the Fabric semantic model using your credentials.

### Setup Instructions

1.  Navigate to the app directory:
    ```bash
    cd 05_bi_fabric/Fabric_App
    ```

2.  Install all required dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  **Previewing in Fabric**: To view the app integrated within the Fabric Shell context, navigate to your workspace in the Fabric portal, open the associated Fabric App artifact, and append `&devUri=http://localhost:5173` to the URL. This tunnels your local development environment directly into the cloud portal.

## 🧪 Testing

The app utilizes Playwright for component and end-to-end testing, alongside Vitest for unit tests on DAX query formatting and data-table parsing logic.

*   Run unit tests: `npm run test`
*   Run UI component tests: `npx playwright test`