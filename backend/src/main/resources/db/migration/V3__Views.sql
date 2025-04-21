-- Monthly metrics view (for income/expense cards)
CREATE OR REPLACE VIEW monthly_metrics AS
SELECT m.id                                     AS month_id,
       m.year,
       m.month,
       COALESCE((SELECT SUM(t.amount)
                 FROM transactions t
                          JOIN categories c ON t.category_id = c.id
                          JOIN transaction_types tt ON c.transaction_type_id = tt.id
                 WHERE t.month_id = m.id
                   AND tt.name = 'Income'), 0)  AS total_income,

       COALESCE((SELECT SUM(t.amount)
                 FROM transactions t
                          JOIN categories c ON t.category_id = c.id
                          JOIN transaction_types tt ON c.transaction_type_id = tt.id
                 WHERE t.month_id = m.id
                   AND tt.name = 'Expense'), 0) AS total_expenses,

       m.expense_target,

       LAG(COALESCE((SELECT SUM(t.amount)
                     FROM transactions t
                              JOIN categories c ON t.category_id = c.id
                              JOIN transaction_types tt ON c.transaction_type_id = tt.id
                     WHERE t.month_id = m.id
                       AND tt.name = 'Income'), 0) OVER (ORDER BY m.year, m.month) AS prev_month_income,
           LAG(COALESCE((SELECT SUM(t.amount)
                         FROM transactions t
                                  JOIN categories c ON t.category_id = c.id
                                  JOIN transaction_types tt ON c.transaction_type_id = tt.id
                         WHERE t.month_id = m.id
                           AND tt.name = 'Expense'), 0) OVER (ORDER BY m.year, m.month) AS prev_month_expenses
               FROM
               months m;

-- Yearly expense overview (for bar chart)
CREATE OR REPLACE VIEW yearly_expenses AS
SELECT m.year,
       m.month,
       COALESCE(SUM(t.amount), 0) AS total_expenses
FROM months m
         LEFT JOIN transactions t ON m.id = t.month_id
         LEFT JOIN categories c ON t.category_id = c.id
         LEFT JOIN transaction_types tt ON c.transaction_type_id = tt.id
WHERE tt.name = 'Expense'
  AND m.year = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY m.year, m.month
ORDER BY m.month;

-- Recent transactions (for recent transactions widget)
CREATE OR REPLACE VIEW recent_transactions AS
SELECT t.id,
       t.date,
       t.amount,
       t.description,
       c.name  AS category,
       s.name  AS subcategory,
       tt.name AS type,
       c.color
FROM transactions t
         JOIN categories c ON t.category_id = c.id
         LEFT JOIN subcategories s ON t.subcategory_id = s.id
         JOIN transaction_types tt ON c.transaction_type_id = tt.id
ORDER BY t.date DESC, t.created_at DESC
LIMIT 5;