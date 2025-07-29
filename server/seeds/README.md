# Database Seeding Guide

This directory contains SQL files for seeding the Travel Mate database with sample data for development and testing purposes.

## Seed Files Overview

### 001_users_seed.sql
Creates 4 sample users with different profiles:
- **John Doe** (john.doe@example.com) - Regular user, notifications enabled
- **Jane Smith** (jane.smith@example.com) - Regular user, notifications enabled  
- **Admin User** (admin@travelmate.com) - Admin account, notifications enabled
- **Test User** (test.user@example.com) - Test account, notifications disabled, Afrikaans language

**Default Password**: `password123` (hashed with bcrypt)

### 002_destinations_seed.sql
Creates comprehensive destination data including:
- **Major Cities**: Cape Town, Johannesburg, Durban, Pretoria, etc.
- **Transport Hubs**: Airports, major taxi ranks
- **Shopping Centers**: Canal Walk, Gateway, Menlyn Park, etc.
- **Universities**: UCT, Wits, UKZN, Rhodes
- **Industrial Areas**: Various industrial zones
- **Townships**: Soweto, Alexandra, Mitchell's Plain, Khayelitsha
- **Risk Levels**: 1 (Very Low) to 5 (Very High)

Total destinations: ~40 locations across all major South African cities

### 003_alerts_seed.sql
Creates diverse alert scenarios:
- **Safety Alerts**: High-risk area warnings, security incidents
- **Traffic Alerts**: Route delays, road closures, accidents
- **Weather Alerts**: Rain, fog, severe weather warnings
- **Service Updates**: New routes, fare changes, schedule updates
- **System Notifications**: Maintenance, app updates, milestones
- **Community Alerts**: Events, protests, celebrations

Total alerts: ~30 alerts with varied priorities and timestamps

### 004_additional_scenarios_seed.sql
Advanced testing scenarios including:
- **Edge Cases**: Border posts, remote areas, coastal regions
- **Time-sensitive Data**: Recent check times, read timestamps
- **Risk Level Changes**: Escalation and improvement scenarios
- **Historical Data**: Past alerts for analytics testing
- **Special Locations**: Tourist destinations, mountain areas

## Risk Level Guidelines

| Level | Description | Examples |
|-------|-------------|----------|
| 1 | Very Low | Universities, tourist areas, upmarket suburbs |
| 2 | Low | Shopping centers, residential areas, small towns |
| 3 | Medium | City centers, busy transport hubs, mixed areas |
| 4 | High | Known problem areas, some townships, busy intersections |
| 5 | Very High | High-crime areas, conflict zones, dangerous locations |

## Alert Priority Guidelines

| Priority | Description | Examples |
|----------|-------------|----------|
| Low | Informational | Welcome messages, milestones, general updates |
| Medium | Important | Weather alerts, service changes, scheduled events |
| High | Urgent | Safety warnings, road closures, emergency situations |

## Running the Seeds

### Quick Start
```bash
# Run all seeds in order
npm run db:seed
```

### Manual Execution
```bash
# Execute individual seed files
psql -d travel_mate -f server/seeds/001_users_seed.sql
psql -d travel_mate -f server/seeds/002_destinations_seed.sql
psql -d travel_mate -f server/seeds/003_alerts_seed.sql
psql -d travel_mate -f server/seeds/004_additional_scenarios_seed.sql
```

### Full Database Reset
```bash
# Drop, recreate, migrate, and seed
npm run db:reset
```

## Data Relationships

### Users → Destinations
- Each user has multiple monitored destinations
- User 1: Cape Town area focus
- User 2: Johannesburg/Pretoria focus  
- User 3: Eastern Cape focus
- User 4: Mixed locations

### Users → Alerts
- Each user receives relevant alerts for their areas
- Mix of read/unread status for testing
- Various timestamps for testing time-based features

### Destinations → Alerts
- Some alerts reference specific destinations
- Risk level changes trigger alerts
- Location-based notifications

## Testing Scenarios

### Authentication Testing
- Use any of the 4 seeded users
- Password: `password123`
- Test different notification preferences

### Destination Management
- Test CRUD operations on destinations
- Verify risk level filtering
- Test location search functionality

### Alert System
- Test alert creation and delivery
- Verify priority-based sorting
- Test read/unread status changes
- Check timestamp-based queries

### Edge Cases
- Remote locations with sparse data
- High-risk areas with frequent alerts
- Historical data for analytics
- Cross-user alert scenarios

## Customization

### Adding New Destinations
```sql
INSERT INTO monitored_destinations (location, risk_level, user_id, latitude, longitude) VALUES
('Your Location', 3, 1, -26.0000, 28.0000);
```

### Adding New Alerts
```sql
INSERT INTO alerts (user_id, title, message, status, priority) VALUES
(1, 'Your Alert Title', 'Your alert message', 'unread', 'medium');
```

### Updating Risk Levels
```sql
UPDATE monitored_destinations 
SET risk_level = 4 
WHERE location = 'Location Name';
```

## Data Cleanup

### Clear All Seed Data
```sql
-- Clear in reverse order due to foreign keys
DELETE FROM alerts;
DELETE FROM monitored_destinations;
DELETE FROM users;
```

### Reset Sequences
```sql
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE monitored_destinations_id_seq RESTART WITH 1;
ALTER SEQUENCE alerts_id_seq RESTART WITH 1;
```

## Notes

- All seed files use `ON CONFLICT DO NOTHING` to prevent duplicate data
- Timestamps use PostgreSQL interval functions for realistic data
- Coordinates are real South African locations
- Risk levels reflect realistic safety assessments
- Alert messages are contextually relevant to South African travel
