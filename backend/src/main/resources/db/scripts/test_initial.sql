insert into periods
    (expense_target, month, starting_balance, year)
VALUES (300.00, 3, 4000.00, 2025);

insert into periods
    (expense_target, month, starting_balance, year)
VALUES (300.00, 4, 5000.00, 2025);

insert into categories (name)
values ('INCOME');
insert into categories (name)
values ('EXPENSE');
insert into categories (name)
values ('INVERSION');
insert into categories (name)
values ('DEBT');

insert into subcategories (name)
values ('Ocio');
insert into subcategories (name)
values ('Comer fuera');
insert into subcategories (name)
values ('Compras');

insert into transactions
(amount, created_at, date, description, is_recurring, notes, category_id, period_id, subcategory_id)
values (1413.00, NOW(), '2025-04-23', 'Nómina mensual', TRUE,
        NULL, 1, 1, NULL);

insert into transactions
(amount, created_at, date, description, is_recurring, notes, category_id, period_id, subcategory_id)
values (1413.00, NOW(), '2025-04-23', 'Nómina mensual', TRUE,
        NULL, 1, 2, NULL);

insert into transactions
(amount, created_at, date, description, is_recurring, notes, category_id, period_id, subcategory_id)
values (50.00, NOW(), '2025-04-23', 'Mercadona (varios)', FALSE,
        NULL, 2, 1, 3);

insert into transactions
(amount, created_at, date, description, is_recurring, notes, category_id, period_id, subcategory_id)
values (50.00, NOW(), '2025-04-23', 'Mercadona (otros)', FALSE,
        NULL, 2, 2, 3);

insert into params (created_at, name, value)
VALUES (NOW(), 'SALARY', '1418.98')

insert into params (created_at, name, value)
VALUES (NOW(), 'EXPENSE_TARGET', '30')

insert into balance_snapshot (current_amount, last_updated, type)
values (0, NOW(), 'SURPLUS')