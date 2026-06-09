-- admin_seed.sql
INSERT INTO users (username, email, password_hash)
VALUES
  ('admin', 'admin@example.com', 'hashed_password_here');
