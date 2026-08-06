SELECT 
    customer_id,
    name,
    email,
    city,
    signup_date
FROM {{ source('silver', 'customers') }}