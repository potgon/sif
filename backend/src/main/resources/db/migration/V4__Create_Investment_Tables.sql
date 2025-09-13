-- Create assets table
CREATE TABLE assets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    isin VARCHAR(50),
    symbol VARCHAR(50),
    asset_type VARCHAR(50) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_isin (user_id, isin)
);

-- Create investments table
CREATE TABLE investments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    asset_id BIGINT NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    transaction_date DATE NOT NULL,
    amount_invested DECIMAL(12,2) NOT NULL,
    shares_quantity DECIMAL(10,6),
    price_per_share DECIMAL(12,4),
    currency VARCHAR(10) NOT NULL,
    exchange_rate DECIMAL(8,4),
    fees DECIMAL(10,2),
    notes TEXT,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_assets_user_id ON assets(user_id);
CREATE INDEX idx_assets_asset_type ON assets(asset_type);
CREATE INDEX idx_investments_asset_id ON investments(asset_id);
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_transaction_date ON investments(transaction_date);
CREATE INDEX idx_investments_transaction_type ON investments(transaction_type);
