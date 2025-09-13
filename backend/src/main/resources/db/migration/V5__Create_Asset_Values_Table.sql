-- Create asset_values table
CREATE TABLE asset_values (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    asset_id BIGINT NOT NULL,
    current_price DECIMAL(12,4),
    current_value DECIMAL(12,2) NOT NULL,
    value_date DATE NOT NULL,
    source VARCHAR(50) DEFAULT 'MANUAL',
    notes TEXT,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_asset_date_user (asset_id, value_date, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_asset_values_asset_id ON asset_values(asset_id);
CREATE INDEX idx_asset_values_user_id ON asset_values(user_id);
CREATE INDEX idx_asset_values_value_date ON asset_values(value_date);
CREATE INDEX idx_asset_values_asset_date ON asset_values(asset_id, value_date);
