-- Core structure
CREATE TABLE months
(
    id   SERIAL PRIMARY KEY,
    year INTEGER NOT NULL CHECK (year > 2000
) ,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    starting_balance DECIMAL(12, 2) NOT NULL,
    expense_target DECIMAL(12, 2),
    UNIQUE(year, month)
);

CREATE TABLE transaction_types
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE -- 'Expense', 'Income', 'Investment', 'Debt'
);

CREATE TABLE categories
(
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(50) NOT NULL UNIQUE,
    transaction_type_id INTEGER REFERENCES transaction_types (id)
);

CREATE TABLE subcategories
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50)                        NOT NULL,
    category_id INTEGER REFERENCES categories (id) NOT NULL,
    UNIQUE (name, category_id)
);

CREATE TABLE transactions
(
    id             SERIAL PRIMARY KEY,
    month_id       INTEGER REFERENCES months (id)     NOT NULL,
    date           DATE                               NOT NULL,
    amount         DECIMAL(12, 2)                     NOT NULL,
    description    TEXT,
    category_id    INTEGER REFERENCES categories (id) NOT NULL,
    subcategory_id INTEGER REFERENCES subcategories (id),
    is_recurring   BOOLEAN                  DEFAULT FALSE,
    notes          TEXT,
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);