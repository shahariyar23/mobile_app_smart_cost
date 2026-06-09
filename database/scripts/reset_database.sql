-- reset_database.sql
TRUNCATE TABLE ai_insights, voice_logs, notifications, goals, budgets, transactions, categories, users RESTART IDENTITY CASCADE;
