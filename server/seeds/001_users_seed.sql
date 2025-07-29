-- Seed data for users table
-- This file contains sample users for development and testing

-- Insert sample users (passwords are hashed for 'password123')
INSERT INTO users (email, password_hash, first_name, last_name, notification_enabled, preferred_language) VALUES
('john.doe@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'John', 'Doe', true, 'en'),
('jane.smith@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'Jane', 'Smith', true, 'en'),
('admin@travelmate.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'Admin', 'User', true, 'en'),
('test.user@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uIoO', 'Test', 'User', false, 'af')
ON CONFLICT (email) DO NOTHING;
