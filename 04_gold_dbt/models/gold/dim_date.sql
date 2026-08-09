WITH date_sequence AS (
    SELECT explode(sequence(to_date('2024-01-01'), to_date('2026-12-31'), interval 1 day)) AS date_day
)
SELECT
    date_day AS date_key,
    YEAR(date_day) AS year,
    MONTH(date_day) AS month,
    DATE_FORMAT(date_day, 'MMMM') AS month_name,
    QUARTER(date_day) AS quarter,
    DAYOFWEEK(date_day) AS day_of_week,
    DATE_FORMAT(date_day, 'EEEE') AS day_name,
    DATE_TRUNC('month', date_day) AS year_month
FROM date_sequence