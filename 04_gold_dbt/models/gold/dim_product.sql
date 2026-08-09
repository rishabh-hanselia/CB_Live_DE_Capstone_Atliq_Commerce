SELECT
    p.product_id,
    p.product_name,
    p.category,
    p.unit_price,
    COALESCE(s.supplier_cost, 0) AS supplier_cost,
    (p.unit_price - COALESCE(s.supplier_cost, 0)) AS unit_margin
FROM {{ ref('stg_products') }} p
LEFT JOIN {{ ref('stg_supplier_price_list') }} s 
    ON p.product_id = s.product_id