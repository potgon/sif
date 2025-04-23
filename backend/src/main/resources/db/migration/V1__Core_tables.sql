-- Core structure
CREATE TABLE periods
(
    id   SERIAL PRIMARY KEY,
    year INTEGER NOT NULL CHECK (year > 2000
) ,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    starting_balance DECIMAL(12, 2) NOT NULL,
    expense_target DECIMAL(12, 2),
    UNIQUE(year, month)
);

CREATE TABLE categories
(
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE subcategories
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE transactions
(
    id             SERIAL PRIMARY KEY,
    period_id      INTEGER REFERENCES periods (id)    NOT NULL,
    date           DATE                               NOT NULL,
    amount         DECIMAL(12, 2)                     NOT NULL,
    description    TEXT,
    category_id    INTEGER REFERENCES categories (id) NOT NULL,
    subcategory_id INTEGER REFERENCES subcategories (id),
    is_recurring   BOOLEAN                  DEFAULT FALSE,
    notes          TEXT,
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);