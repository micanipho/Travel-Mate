-- Seed data for users table
-- This file contains sample users for development and testing

-- Insert sample users (passwords are hashed for 'Password123')
INSERT INTO users (email, password_hash, first_name, last_name, notification_enabled, preferred_language) VALUES
('john.doe@example.com', '$2a$12$iLC1BNGHhpiGvROYGtz/i.t4kzFFP./BvUsy4CgQ/B4SBGXaJLRTK', 'John', 'Doe', true, 'en'),
('jane.smith@example.com', '$2a$12$iLC1BNGHhpiGvROYGtz/i.t4kzFFP./BvUsy4CgQ/B4SBGXaJLRTK', 'Jane', 'Smith', true, 'en'),
('admin@travelmate.com', '$2a$12$iLC1BNGHhpiGvROYGtz/i.t4kzFFP./BvUsy4CgQ/B4SBGXaJLRTK', 'Admin', 'User', true, 'en'),
('test.user@example.com', '$2a$12$iLC1BNGHhpiGvROYGtz/i.t4kzFFP./BvUsy4CgQ/B4SBGXaJLRTK', 'Test', 'User', false, 'af')
ON CONFLICT (email) DO NOTHING;
