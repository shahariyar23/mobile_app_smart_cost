-- cleanup_test_data.sql
DELETE FROM transactions WHERE transaction_date < NOW() - INTERVAL '1 year';
DELETE FROM notifications WHERE created_at < NOW() - INTERVAL '6 months';
DELETE FROM voice_logs WHERE created_at < NOW() - INTERVAL '6 months';
