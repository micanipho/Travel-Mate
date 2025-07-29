-- Seed data for alerts table
-- This file contains sample alerts for development and testing
-- Priority levels: low, medium, high
-- Status: read, unread

-- Insert sample alerts (assuming user IDs 1-4 exist)
INSERT INTO alerts (user_id, title, message, status, priority, created_at) VALUES
-- User 1 alerts (John Doe)
(1, 'Route Delay Alert', 'Your usual route to Cape Town CBD is experiencing delays due to traffic congestion on the N1.', 'unread', 'medium', NOW() - INTERVAL '2 hours'),
(1, 'New Taxi Route Available', 'A new taxi route has been added for your monitored destination: Cape Town to Sandton City.', 'read', 'low', NOW() - INTERVAL '1 day'),
(1, 'Safety Alert: Johannesburg Central', 'Increased security incidents reported in Johannesburg Central area. Exercise caution.', 'unread', 'high', NOW() - INTERVAL '30 minutes'),
(1, 'Fare Update', 'Taxi fares for Cape Town CBD route have been updated. New fare: R15.', 'read', 'low', NOW() - INTERVAL '3 days'),

-- User 2 alerts (Jane Smith)
(2, 'High Risk Area Warning', 'Risk level increased to HIGH for Johannesburg Central area due to recent incidents.', 'unread', 'high', NOW() - INTERVAL '1 hour'),
(2, 'Service Update', 'Taxi services have been updated in your area. New operators available.', 'read', 'medium', NOW() - INTERVAL '2 days'),
(2, 'Weather Alert: Durban', 'Heavy rain and flooding expected in Durban area. Consider alternative routes.', 'unread', 'medium', NOW() - INTERVAL '4 hours'),
(2, 'Peak Hour Notice', 'Peak hour surcharge now applies for Pretoria CBD routes (7-9 AM, 5-7 PM).', 'read', 'low', NOW() - INTERVAL '1 week'),

-- User 3 alerts (Admin User)
(3, 'Weather Alert', 'Heavy rain expected in Port Elizabeth. Plan your journey accordingly and allow extra time.', 'unread', 'medium', NOW() - INTERVAL '3 hours'),
(3, 'Welcome to Travel Mate', 'Thank you for joining Travel Mate! Start by adding your destinations to receive personalized alerts.', 'read', 'low', NOW() - INTERVAL '1 month'),
(3, 'Route Optimization', 'New optimized route available for Stellenbosch University. 15% faster travel time.', 'unread', 'low', NOW() - INTERVAL '6 hours'),
(3, 'Community Update', 'Your area safety rating has improved thanks to community reporting. Keep it up!', 'read', 'low', NOW() - INTERVAL '5 days'),

-- User 4 alerts (Test User)
(4, 'System Maintenance', 'Scheduled maintenance will occur tonight from 2-4 AM. Some features may be unavailable.', 'unread', 'low', NOW() - INTERVAL '8 hours'),
(4, 'Emergency Alert', 'Road closure on R61 near East London CBD due to accident. Use alternative routes.', 'unread', 'high', NOW() - INTERVAL '45 minutes'),
(4, 'Driver Rating Update', 'Your recent trip driver has been highly rated by the community. Thank you for your feedback!', 'read', 'low', NOW() - INTERVAL '2 days'),
(4, 'New Feature Available', 'Real-time GPS tracking is now available for all your monitored routes.', 'read', 'medium', NOW() - INTERVAL '1 week'),

-- Cross-user system alerts
(1, 'App Update Available', 'Travel Mate v2.1 is now available with improved safety features and better route optimization.', 'read', 'medium', NOW() - INTERVAL '4 days'),
(2, 'Holiday Schedule', 'Modified taxi schedules during Heritage Day weekend. Check updated timetables.', 'unread', 'medium', NOW() - INTERVAL '12 hours'),
(3, 'Security Enhancement', 'New security features added: panic button and emergency contacts integration.', 'read', 'medium', NOW() - INTERVAL '6 days'),
(4, 'Community Milestone', 'Travel Mate community has reached 10,000 active users! Thank you for being part of our journey.', 'read', 'low', NOW() - INTERVAL '1 week'),

-- Recent urgent alerts
(1, 'Strike Action Alert', 'Taxi strike action reported in Cape Town area. Limited services available.', 'unread', 'high', NOW() - INTERVAL '15 minutes'),
(2, 'Load Shedding Impact', 'Stage 4 load shedding may affect traffic lights. Allow extra travel time.', 'unread', 'medium', NOW() - INTERVAL '1 hour'),
(3, 'Protest March Notice', 'Planned protest march in Bloemfontein CBD tomorrow 10 AM - 2 PM. Expect delays.', 'unread', 'medium', NOW() - INTERVAL '18 hours'),
(4, 'Vehicle Breakdown Alert', 'Multiple vehicle breakdowns reported on N2 near King William''s Town. Traffic moving slowly.', 'unread', 'medium', NOW() - INTERVAL '2 hours'),

-- Positive community alerts
(1, 'Safe Journey Milestone', 'Congratulations! You''ve completed 50 safe journeys with Travel Mate.', 'read', 'low', NOW() - INTERVAL '3 days'),
(2, 'Community Hero', 'Thank you for reporting the road hazard. Your report helped keep other travelers safe.', 'read', 'low', NOW() - INTERVAL '1 week'),
(3, 'Route Efficiency', 'Your regular Stellenbosch route is now 20% more efficient thanks to community data.', 'read', 'low', NOW() - INTERVAL '5 days'),
(4, 'Feedback Appreciated', 'Your driver feedback has been submitted. Community ratings help improve service quality.', 'read', 'low', NOW() - INTERVAL '2 days')

ON CONFLICT DO NOTHING;
