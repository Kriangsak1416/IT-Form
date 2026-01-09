USE phos_db;

-- Note: Using existing phos_person table
-- Columns: phos_username_pid (username), phos_password_year (password)
-- If table doesn't exist, create it with the required structure
CREATE TABLE IF NOT EXISTS phos_person (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phos_username_pid VARCHAR(255) UNIQUE NOT NULL,
  phos_password_year VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert test user (password: password123)
INSERT INTO phos_person (phos_username_pid, phos_password_year, name) VALUES (
  'test@example.com',
  '$2a$10$YourHashedPasswordHere',
  'Test User'
) ON DUPLICATE KEY UPDATE id=id;
