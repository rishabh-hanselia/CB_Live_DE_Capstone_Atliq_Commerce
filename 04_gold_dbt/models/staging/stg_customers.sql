SELECT 
    customer_id,
    customer_name AS name,
    email,
    city,
    signup_date
FROM {{ source('silver', 'customers') }}