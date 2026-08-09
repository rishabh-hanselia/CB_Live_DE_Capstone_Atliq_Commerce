import os
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL

# Load variables from .env
load_dotenv()

server = os.getenv("AZ_SQL_SERVER")
database = os.getenv("AZ_SQL_DB")
username = os.getenv("AZ_SQL_USER")
password = os.getenv("AZ_SQL_PASSWORD")

# Safely construct the connection URL
connection_url = URL.create(
    "mssql+pyodbc",
    username=username,
    password=password,
    host=server,
    port=1433,
    database=database,
    query={
        "driver": "ODBC Driver 18 for SQL Server",
        "Encrypt": "yes",
        "TrustServerCertificate": "no",
    },
)

engine = create_engine(connection_url)

# Define CSV files with relative path to the 'csv' folder
csv_files = {
    "supplier_price_list": os.path.join("..", "csv", "supplier_price_list.csv"),
    "marketing_spend": os.path.join("..", "csv", "marketing_spend.csv"),
}

for table_name, file_path in csv_files.items():
    if os.path.exists(file_path):
        df = pd.read_csv(file_path)
        df.to_sql(table_name, engine, if_exists="replace", index=False)
        print(f"✅ Successfully loaded '{file_path}' into Azure SQL table '{table_name}'")
    else:
        print(f"❌ File not found at path: {os.path.abspath(file_path)}")