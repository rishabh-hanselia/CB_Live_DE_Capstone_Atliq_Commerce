SELECT 
    order_id,
    customer_id,
    order_date,
    order_amount,
    status
FROM {{ source('silver', 'orders') }}