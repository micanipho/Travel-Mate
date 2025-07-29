-- Seed data for monitored_destinations table
-- This file contains sample destinations for development and testing
-- Risk levels: 1 = Very Low, 2 = Low, 3 = Medium, 4 = High, 5 = Very High

-- Insert sample destinations (assuming user IDs 1-4 exist)
INSERT INTO monitored_destinations (location, risk_level, user_id, latitude, longitude) VALUES
-- User 1 destinations (John Doe)
('Cape Town CBD', 3, 1, -33.9249, 18.4241),
('Johannesburg Central', 4, 1, -26.2041, 28.0473),
('Sandton City', 2, 1, -26.1076, 28.0567),
('Cape Town International Airport', 2, 1, -33.9648, 18.6017),

-- User 2 destinations (Jane Smith)
('Durban Beachfront', 2, 2, -29.8587, 31.0218),
('Pretoria CBD', 3, 2, -25.7479, 28.2293),
('Rosebank Mall', 2, 2, -26.1467, 28.0436),
('OR Tambo International Airport', 3, 2, -26.1392, 28.2460),

-- User 3 destinations (Admin User)
('Port Elizabeth Central', 3, 3, -33.9608, 25.6022),
('Bloemfontein CBD', 2, 3, -29.0852, 26.1596),
('Stellenbosch University', 1, 3, -33.9321, 18.8602),
('Hermanus', 1, 3, -34.4187, 19.2345),

-- User 4 destinations (Test User)
('East London CBD', 3, 4, -32.9783, 27.8546),
('Pietermaritzburg CBD', 2, 4, -29.6094, 30.3781),
('Kimberley CBD', 3, 4, -28.7282, 24.7499),
('Polokwane CBD', 3, 4, -23.9045, 29.4689),

-- Additional popular destinations across users
('Soweto', 4, 1, -26.2678, 27.8546),
('Alexandra Township', 5, 2, -26.1009, 28.0963),
('Mitchell''s Plain', 4, 3, -34.0364, 18.6282),
('Khayelitsha', 4, 4, -34.0351, 18.6920),

-- Shopping centers and transport hubs
('Canal Walk Shopping Centre', 1, 1, -33.8947, 18.4977),
('Gateway Theatre of Shopping', 2, 2, -29.7630, 31.0218),
('Menlyn Park Shopping Centre', 2, 3, -25.7845, 28.2774),
('Eastgate Shopping Centre', 3, 4, -26.1891, 28.1631),

-- Universities and educational institutions
('University of Cape Town', 2, 1, -33.9577, 18.4612),
('University of the Witwatersrand', 3, 2, -26.1929, 28.0305),
('University of KwaZulu-Natal', 2, 3, -29.8674, 30.9821),
('Rhodes University', 2, 4, -33.3159, 26.5336),

-- Industrial and business areas
('Atlantis Industrial', 3, 1, -33.5847, 18.4977),
('Rosslyn Industrial', 3, 2, -25.6167, 28.1167),
('Pinetown Industrial', 3, 3, -29.8167, 30.8667),
('King William''s Town', 3, 4, -32.8833, 27.4000)

ON CONFLICT DO NOTHING;
