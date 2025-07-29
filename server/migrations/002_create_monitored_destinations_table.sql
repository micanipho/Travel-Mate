-- Migration: Create monitored_destinations table
-- Created: 2024-01-01
-- Description: Creates the monitored_destinations table with foreign key to users

CREATE TABLE IF NOT EXISTS monitored_destinations (
  id SERIAL PRIMARY KEY,
  location TEXT NOT NULL,
  risk_level INTEGER CHECK (risk_level >= 1 AND risk_level <= 5),
  last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_monitored_destinations_user_id ON monitored_destinations(user_id);
CREATE INDEX IF NOT EXISTS idx_monitored_destinations_risk_level ON monitored_destinations(risk_level);
CREATE INDEX IF NOT EXISTS idx_monitored_destinations_location ON monitored_destinations USING gin(to_tsvector('english', location));
CREATE INDEX IF NOT EXISTS idx_monitored_destinations_coordinates ON monitored_destinations(latitude, longitude);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_monitored_destinations_updated_at 
  BEFORE UPDATE ON monitored_destinations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
