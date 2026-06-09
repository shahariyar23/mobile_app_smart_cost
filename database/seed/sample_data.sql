-- sample_data.sql
INSERT INTO transactions (user_id, category_id, amount, type, note, transaction_date)
VALUES
  (1, 1, 12.50, 'expense', 'Lunch at cafe', '2026-06-01'),
  (1, 2, 3.75, 'expense', 'Bus fare', '2026-06-01'),
  (1, 3, 1500.00, 'income', 'Monthly salary', '2026-06-01');

INSERT INTO budgets (user_id, category_id, amount, period, start_date, end_date)
VALUES
  (1, 1, 200.00, 'monthly', '2026-06-01', '2026-06-30');

INSERT INTO goals (user_id, title, target_amount, current_amount, due_date, status)
VALUES
  (1, 'Emergency fund', 1000.00, 150.00, '2026-12-31', 'active');
