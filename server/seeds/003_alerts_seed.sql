-- Seed data for alerts table
-- This file contains sample alerts for development and testing

-- Insert sample alerts (assuming user IDs 1-4 exist)
INSERT INTO alerts (user_id, title, message, status, priority) VALUES
(1, 'Route Delay Alert', 'Your usual route to Cape Town CBD is experiencing delays due to traffic.', 'unread', 'medium'),
(1, 'New Taxi Route Available', 'A new taxi route has been added for your monitored destination.', 'read', 'low'),
(2, 'High Risk Area Warning', 'Increased risk level reported for Johannesburg Central area.', 'unread', 'high'),
(2, 'Service Update', 'Taxi services have been updated in your area.', 'read', 'medium'),
(3, 'Weather Alert', 'Heavy rain expected in Port Elizabeth. Plan your journey accordingly.', 'unread', 'medium'),
(3, 'Welcome to Travel Mate', 'Thank you for joining Travel Mate! Start by adding your destinations.', 'read', 'low'),
(4, 'System Maintenance', 'Scheduled maintenance will occur tonight from 2-4 AM.', 'unread', 'low')
ON CONFLICT DO NOTHING;
