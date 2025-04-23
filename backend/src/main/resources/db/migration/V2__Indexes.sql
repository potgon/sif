-- Indexes for performance
CREATE INDEX idx_transactions_periods ON transactions (period_id);
CREATE INDEX idx_transactions_date ON transactions (date);
CREATE INDEX idx_transactions_category ON transactions (category_id);