-- Seed data for monitored_destinations table
-- This file contains sample destinations for development and testing

-- Insert sample destinations (assuming user IDs 1-4 exist)
INSERT INTO monitored_destinations (location, risk_level, user_id, latitude, longitude) VALUES
('Cape Town CBD', 3, 1, -33.9249, 18.4241),
('Johannesburg Central', 4, 1, -26.2041, 28.0473),
('Durban Beachfront', 2, 2, -29.8587, 31.0218),
('Pretoria CBD', 3, 2, -25.7479, 28.2293),
('Port Elizabeth Central', 3, 3, -33.9608, 25.6022),
('Bloemfontein CBD', 2, 3, -29.0852, 26.1596),
('East London CBD', 3, 4, -32.9783, 27.8546),
('Pietermaritzburg CBD', 2, 4, -29.6094, 30.3781)
ON CONFLICT DO NOTHING;
