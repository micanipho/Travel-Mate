# Travel Mate Database Seeding Guide

## Overview

I've implemented a comprehensive database seeding system for your Travel Mate application that includes sample data for alerts and destinations. The system provides realistic, diverse data for development and testing.

## What's Been Created

### 1. Enhanced Seeding Script (`server/scripts/seed.js`)
- ✅ **Fully implemented** Node.js seeding script
- ✅ **Transaction support** for data integrity
- ✅ **Error handling** with detailed logging
- ✅ **Progress tracking** and summary reports
- ✅ **Automatic file ordering** (001_, 002_, etc.)

### 2. Enhanced Sample Data

#### Users (`server/seeds/001_users_seed.sql`)
- 4 sample users with different profiles
- Default password: `password123` (bcrypt hashed)
- Mix of notification preferences and languages

#### Destinations (`server/seeds/002_destinations_seed.sql`)
- **40+ destinations** across South Africa
- **Major cities**: Cape Town, Johannesburg, Durban, Pretoria
- **Transport hubs**: Airports, taxi ranks
- **Shopping centers**: Canal Walk, Gateway, Menlyn Park
- **Universities**: UCT, Wits, UKZN, Rhodes
- **Townships**: Soweto, Alexandra, Mitchell's Plain
- **Risk levels**: 1 (Very Low) to 5 (Very High)

#### Alerts (`server/seeds/003_alerts_seed.sql`)
- **30+ diverse alerts** with realistic scenarios
- **Safety alerts**: High-risk warnings, security incidents
- **Traffic alerts**: Route delays, road closures
- **Weather alerts**: Rain, fog, severe weather
- **Service updates**: New routes, fare changes
- **System notifications**: Maintenance, app updates
- **Community alerts**: Events, milestones

#### Advanced Scenarios (`server/seeds/004_additional_scenarios_seed.sql`)
- **Edge cases**: Border posts, remote areas
- **Time-sensitive data**: Recent timestamps
- **Historical data**: Past alerts for analytics
- **Risk level changes**: Escalation scenarios

### 3. Documentation
- ✅ **Comprehensive README** (`server/seeds/README.md`)
- ✅ **Usage examples** and customization guide
- ✅ **Data relationship explanations**
- ✅ **Testing scenarios** documentation

### 4. Manual Seeding Script (`server/scripts/manual_seed.sh`)
- ✅ **Bash script** for environments without Node.js
- ✅ **PostgreSQL direct execution**
- ✅ **Progress tracking** and error handling
- ✅ **Summary reports** with data counts

## How to Use

### Option 1: Using Node.js (Recommended)

```bash
# Navigate to server directory
cd server

# Install dependencies (if not already done)
npm install

# Run database seeding
npm run db:seed

# Or run full database reset (drop + create + migrate + seed)
npm run db:reset
```

### Option 2: Manual PostgreSQL Execution

```bash
# Make the script executable
chmod +x server/scripts/manual_seed.sh

# Run the manual seeding script
./server/scripts/manual_seed.sh

# Or execute individual files
psql -d travel_mate -f server/seeds/001_users_seed.sql
psql -d travel_mate -f server/seeds/002_destinations_seed.sql
psql -d travel_mate -f server/seeds/003_alerts_seed.sql
psql -d travel_mate -f server/seeds/004_additional_scenarios_seed.sql
```

### Option 3: Direct SQL Execution

```sql
-- Connect to your database and run each file in order
\i server/seeds/001_users_seed.sql
\i server/seeds/002_destinations_seed.sql  
\i server/seeds/003_alerts_seed.sql
\i server/seeds/004_additional_scenarios_seed.sql
```

## Sample Data Overview

### Users Created
| Email | Name | Password | Language | Notifications |
|-------|------|----------|----------|---------------|
| john.doe@example.com | John Doe | password123 | English | Enabled |
| jane.smith@example.com | Jane Smith | password123 | English | Enabled |
| admin@travelmate.com | Admin User | password123 | English | Enabled |
| test.user@example.com | Test User | password123 | Afrikaans | Disabled |

### Destination Categories
- **Major Cities** (8): Cape Town, Johannesburg, Durban, etc.
- **Transport Hubs** (4): Airports, major stations
- **Shopping Centers** (4): Major malls across SA
- **Universities** (4): UCT, Wits, UKZN, Rhodes
- **Townships** (4): Soweto, Alexandra, etc.
- **Industrial Areas** (4): Various industrial zones
- **Special Locations** (8): Borders, coastal, mountain areas

### Alert Types
- **Safety Alerts** (8): Risk warnings, security incidents
- **Traffic Alerts** (6): Delays, closures, accidents
- **Weather Alerts** (4): Rain, fog, severe weather
- **Service Updates** (6): Routes, fares, schedules
- **System Notifications** (4): Maintenance, updates
- **Community Alerts** (4): Events, milestones

## Testing Your Implementation

### 1. Verify Data was Seeded
```sql
-- Check counts
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Destinations', COUNT(*) FROM monitored_destinations  
UNION ALL
SELECT 'Alerts', COUNT(*) FROM alerts;

-- Check alert status distribution
SELECT status, COUNT(*) FROM alerts GROUP BY status;

-- Check risk level distribution  
SELECT risk_level, COUNT(*) FROM monitored_destinations GROUP BY risk_level;
```

### 2. Test Authentication
- Login with any seeded user using password `password123`
- Test different notification preferences

### 3. Test API Endpoints
```bash
# Get user destinations
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/destinations

# Get user alerts
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/alerts

# Get unread alert count
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/alerts/unread-count
```

## Customization

### Adding More Destinations
Edit `server/seeds/002_destinations_seed.sql`:
```sql
INSERT INTO monitored_destinations (location, risk_level, user_id, latitude, longitude) VALUES
('Your New Location', 3, 1, -26.0000, 28.0000);
```

### Adding More Alerts
Edit `server/seeds/003_alerts_seed.sql`:
```sql
INSERT INTO alerts (user_id, title, message, status, priority) VALUES
(1, 'Your Alert', 'Alert message', 'unread', 'medium');
```

### Creating New Seed Files
1. Create `server/seeds/005_your_data_seed.sql`
2. Follow the naming convention (005_, 006_, etc.)
3. Use `ON CONFLICT DO NOTHING` to prevent duplicates
4. The seeding script will automatically include it

## Troubleshooting

### Common Issues
1. **"relation does not exist"** - Run migrations first: `npm run db:migrate`
2. **"duplicate key value"** - Clear existing data or use `ON CONFLICT DO NOTHING`
3. **"permission denied"** - Check database user permissions
4. **"connection refused"** - Verify database is running and connection settings

### Data Cleanup
```sql
-- Clear all seed data (in reverse order due to foreign keys)
DELETE FROM alerts;
DELETE FROM monitored_destinations;  
DELETE FROM users WHERE email LIKE '%example.com' OR email LIKE '%travelmate.com';
```

## Next Steps

1. **Run the seeding** using your preferred method above
2. **Test the API endpoints** with the seeded data
3. **Customize the data** as needed for your specific use cases
4. **Write tests** using the seeded data as fixtures
5. **Implement the controller logic** to work with this data structure

The seeding system is now ready to provide you with comprehensive sample data for developing and testing your Travel Mate application!
