-- Additional seed data for advanced testing scenarios
-- This file contains more complex data relationships and edge cases

-- Update some destinations with more recent check times
UPDATE monitored_destinations 
SET last_checked = NOW() - INTERVAL '5 minutes'
WHERE location IN ('Cape Town CBD', 'Johannesburg Central', 'Durban Beachfront');

UPDATE monitored_destinations 
SET last_checked = NOW() - INTERVAL '2 hours'
WHERE location IN ('Pretoria CBD', 'Port Elizabeth Central');

UPDATE monitored_destinations 
SET last_checked = NOW() - INTERVAL '1 day'
WHERE location IN ('Bloemfontein CBD', 'East London CBD');

-- Add some alerts with read timestamps
UPDATE alerts 
SET read_at = created_at + INTERVAL '30 minutes'
WHERE status = 'read' AND read_at IS NULL;

-- Insert some time-sensitive alerts for testing
INSERT INTO alerts (user_id, title, message, status, priority, created_at) VALUES
-- Recent high-priority alerts
(1, 'URGENT: Road Closure', 'N1 highway closed due to accident near Paarl. Estimated reopening: 2 hours.', 'unread', 'high', NOW() - INTERVAL '10 minutes'),
(2, 'URGENT: Service Disruption', 'All taxi services suspended in Soweto due to unrest. Avoid the area.', 'unread', 'high', NOW() - INTERVAL '5 minutes'),

-- Scheduled future alerts (for testing notification systems)
(3, 'Scheduled Maintenance', 'Planned road maintenance on M3 highway tomorrow 6 AM - 10 AM.', 'unread', 'medium', NOW() - INTERVAL '1 day'),
(4, 'Event Traffic Warning', 'Rugby match at Ellis Park Saturday. Expect heavy traffic around Johannesburg CBD.', 'unread', 'medium', NOW() - INTERVAL '2 days'),

-- Historical alerts for analytics
(1, 'Route Completed', 'Your journey from Cape Town CBD to Sandton City completed successfully.', 'read', 'low', NOW() - INTERVAL '1 week'),
(2, 'Safety Report', 'Weekly safety report: Your monitored areas had 0 incidents this week.', 'read', 'low', NOW() - INTERVAL '1 week'),
(3, 'Monthly Summary', 'Monthly travel summary: 45 trips, 98% on-time performance.', 'read', 'low', NOW() - INTERVAL '1 month'),
(4, 'Quarterly Review', 'Quarterly safety review: All your routes maintain good safety ratings.', 'read', 'low', NOW() - INTERVAL '3 months');

-- Add some destinations with edge case coordinates
INSERT INTO monitored_destinations (location, risk_level, user_id, latitude, longitude, last_checked) VALUES
-- Border areas
('Beitbridge Border Post', 4, 1, -22.2167, 30.0000, NOW() - INTERVAL '6 hours'),
('Maseru Bridge Border', 3, 2, -29.3167, 27.4833, NOW() - INTERVAL '4 hours'),

-- Remote areas
('Upington', 2, 3, -28.4478, 21.2561, NOW() - INTERVAL '1 day'),
('Springbok', 2, 4, -29.6647, 17.8856, NOW() - INTERVAL '2 days'),

-- Coastal areas
('Hermanus Whale Watching', 1, 1, -34.4187, 19.2345, NOW() - INTERVAL '3 hours'),
('Jeffrey''s Bay', 2, 2, -34.0489, 24.9089, NOW() - INTERVAL '5 hours'),

-- Mountain areas
('Drakensberg Mountains', 3, 3, -28.7500, 29.2500, NOW() - INTERVAL '8 hours'),
('Table Mountain', 2, 4, -33.9628, 18.4098, NOW() - INTERVAL '2 hours')

ON CONFLICT DO NOTHING;

-- Create some test scenarios for different risk levels
INSERT INTO alerts (user_id, title, message, status, priority, created_at) VALUES
-- Risk level escalation scenarios
(1, 'Risk Level Change', 'Cape Town CBD risk level increased from MEDIUM to HIGH due to recent incidents.', 'unread', 'high', NOW() - INTERVAL '30 minutes'),
(2, 'Risk Level Improvement', 'Durban Beachfront risk level decreased from MEDIUM to LOW. Enjoy safer travels!', 'read', 'low', NOW() - INTERVAL '2 hours'),

-- Weather-related scenarios
(3, 'Severe Weather Warning', 'Severe thunderstorm warning for Port Elizabeth. Avoid travel if possible.', 'unread', 'high', NOW() - INTERVAL '1 hour'),
(4, 'Fog Alert', 'Dense fog reported in East London area. Reduced visibility, drive carefully.', 'unread', 'medium', NOW() - INTERVAL '3 hours'),

-- Traffic and infrastructure
(1, 'Bridge Closure', 'Nelson Mandela Bridge closed for emergency repairs. Use alternative routes.', 'unread', 'medium', NOW() - INTERVAL '4 hours'),
(2, 'New Traffic Lights', 'New traffic lights installed at Rosebank intersection. Expect initial delays.', 'read', 'low', NOW() - INTERVAL '1 day'),

-- Community and social
(3, 'Community Event', 'Heritage Day celebration in Stellenbosch. Road closures 9 AM - 6 PM.', 'unread', 'low', NOW() - INTERVAL '12 hours'),
(4, 'Safety Initiative', 'New community safety patrol started in your area. Report any concerns.', 'read', 'low', NOW() - INTERVAL '3 days')

ON CONFLICT DO NOTHING;
