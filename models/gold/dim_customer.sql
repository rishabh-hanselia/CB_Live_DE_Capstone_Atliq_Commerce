SELECT
    customer_id,
    name AS customer_name,
    email,
    city,
    signup_date,
    DATE_TRUNC('month', signup_date) AS signup_cohort
FROM {{ ref('stg_customers') }}