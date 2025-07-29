-- Seed data for users table
-- This file contains sample users for development and testing

-- Insert sample users (passwords are hashed for 'password123')
INSERT INTO users (email, password_hash, first_name, last_name, notification_enabled, preferred_language) VALUES
('john.doe@example.com', '$2a$12$5gfCX9lNNw8WN/nxusTTFOnIeAwq8vr3Qc9fnIwJoCgrbSEt0IxXi', 'John', 'Doe', true, 'en'),
('jane.smith@example.com', '$2a$12$5gfCX9lNNw8WN/nxusTTFOnIeAwq8vr3Qc9fnIwJoCgrbSEt0IxXi', 'Jane', 'Smith', true, 'en'),
('admin@travelmate.com', '$2a$12$5gfCX9lNNw8WN/nxusTTFOnIeAwq8vr3Qc9fnIwJoCgrbSEt0IxXi', 'Admin', 'User', true, 'en'),
('test.user@example.com', '$2a$12$5gfCX9lNNw8WN/nxusTTFOnIeAwq8vr3Qc9fnIwJoCgrbSEt0IxXi', 'Test', 'User', false, 'af')
ON CONFLICT (email) DO NOTHING;
