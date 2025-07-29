# Travel Mate

**Enhancing urban mobility through community-driven taxi information and support**

## Overview

Travel Mate is a community-driven mobile application designed to improve the taxi commuting experience in South Africa by providing real-time information, route tracking, and community-based data sharing. The platform addresses common challenges faced by taxi commuters including unreliable schedules, lack of real-time updates, and difficulty finding available taxis.

## Problem Statement

The current taxi system faces several critical challenges:
- **Unreliable schedules** cause frustration for commuters
- **Lack of real-time updates** leads to confusion and extended waiting times
- **Difficulty finding available taxis** increases overall travel time and uncertainty

## Solution

Our community-driven approach leverages user-generated data to provide:
- Real-time taxi availability and route information
- Interactive mapping for route navigation
- Community feedback and validation system
- Incentivized participation through rewards and recognition

## Key Features

### 🗺️ Interactive Mapping
- Real-time route visualization
- Taxi rank locations and availability
- Turn-by-turn navigation assistance

### 📱 Real-Time Updates
- Live notifications about taxi availability
- Delay alerts and schedule changes
- Community-reported incidents and updates

### 👥 Community-Driven Data
- User-generated route information
- Community validation and moderation
- Feedback system for continuous improvement

### 🎯 Incentives & Rewards
- User recognition system
- Reward programs for active contributors
- Referral bonuses for community growth

### 📊 Data Validation
- Cross-verification of community data
- Regular updates and accuracy checks
- Community moderation oversight

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT/OAuth/Sessions
- **Testing**: Jest, Cypress, Supertest

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-org/sa-taxi-tracker.git
cd sa-taxi-tracker
```

2. Install dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Database Setup
```bash
# Create PostgreSQL database
createdb sa_taxi_tracker

# Run database migrations
npm run migrate

# Seed with sample data
npm run seed
```

4. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Configure your PostgreSQL connection
DATABASE_URL=postgresql://username:password@localhost:5432/sa_taxi_tracker
JWT_SECRET=your_jwt_secret_here
PORT=3000
```

5. Start the application
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend application (from client directory)
npm start
```

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  notification_enabled BOOLEAN DEFAULT true,
  preferred_language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Monitored Destinations Table
```sql
CREATE TABLE monitored_destinations (
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
```

#### Alerts Table
```sql
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('read', 'unread')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);
```

## Architecture

### Backend Structure
```
server/
├── controllers/       # Route handlers
├── middleware/       # Authentication, validation
├── models/          # PostgreSQL models and queries
├── routes/          # API route definitions
├── services/        # Business logic
├── migrations/      # Database migration files
├── seeds/           # Sample data for testing
├── tests/           # Test suites
├── config/          # Database and app configuration
└── utils/           # Helper functions
```

### Frontend Structure
```
client/
├── src/
│   ├── components/   # Reusable UI components
│   ├── pages/       # Main application pages
│   ├── services/    # API integration
│   ├── utils/       # Helper functions
│   └── tests/       # Component tests
```

## Core Features Implementation

### Authentication & Authorization
- JWT-based authentication system
- Protected routes for authenticated users
- Role-based access control for moderation features

### Database Integration
- PostgreSQL database with proper schema design
- Connection pooling using pg-pool for optimal performance
- Health-check endpoint: `GET /api/health`
- Migrations and seeding scripts for easy setup

### Required Features

#### 1. User Profile & Preferences
- **Endpoint**: `/api/profile`
- **Features**: View/edit name, email, password, notification settings, preferred routes
- **Database**: Full persistence with validation

#### 2. Alerts/Notifications Dashboard
- **Endpoint**: `/api/alerts`
- **Features**: Real-time alerts for route disruptions, taxi availability, schedule changes
- **Database**: Alert records with timestamp, title, status, and priority

#### 3. Monitored Destinations CRUD
- **Endpoint**: `/api/destinations`
- **Entity**: MonitoredDestination
- **Fields**: 
  - `id`: Unique identifier
  - `location`: Destination name/address
  - `riskLevel`: Safety/reliability rating
  - `lastChecked`: Last update timestamp
- **Operations**: Full Create, Read, Update, Delete functionality

## API Documentation

### Authentication Endpoints
```
POST /api/auth/login     # User login
POST /api/auth/register  # User registration
POST /api/auth/logout    # User logout
GET  /api/auth/verify    # Token verification
```

### User Management
```
GET    /api/profile      # Get user profile
PUT    /api/profile      # Update user profile
GET    /api/users        # List users (admin)
```

### Destinations Management
```
GET    /api/destinations           # List all destinations
POST   /api/destinations           # Create new destination
GET    /api/destinations/:id       # Get specific destination
PUT    /api/destinations/:id       # Update destination
DELETE /api/destinations/:id       # Delete destination
```

### Alerts System
```
GET    /api/alerts                 # Get user alerts
POST   /api/alerts                 # Create new alert
PUT    /api/alerts/:id/read        # Mark alert as read
DELETE /api/alerts/:id             # Delete alert
```

### Database Commands
```
# Database operations
npm run db:create     # Create database
npm run db:migrate    # Run migrations
npm run db:rollback   # Rollback last migration
npm run db:seed       # Seed sample data
npm run db:reset      # Reset database (drop + recreate + migrate + seed)
```

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit      # Unit tests
npm run test:integration  # Integration tests
npm run test:e2e       # End-to-end tests

# Run tests with coverage
npm run test:coverage
```

### Test Coverage
- **Authentication Flow**: Login/logout, protected routes, token validation
- **Database Operations**: PostgreSQL CRUD operations, connection health, transaction handling
- **Core Features**: Profile management, alerts system, destinations CRUD
- **API Integration**: Request/response validation, error handling
- **Database Integrity**: Foreign key constraints, data validation, migration testing

## Community Benefits

### For Commuters
- Reduced waiting times through real-time updates
- Improved route planning and navigation
- Enhanced safety through community reporting

### For Taxi Drivers
- Increased operational efficiency
- Better route optimization
- Enhanced earning potential through improved service

### For the Community
- Strengthened community ties
- Collective problem-solving approach
- Economic empowerment through local business integration

## Revenue Model

### Primary Revenue Sources
1. **Local Business Promotion**: Sponsored listings for businesses, malls, and services
2. **Taxi Rank Partnerships**: Premium listings for taxi ranks and popular routes
3. **Data Analytics**: Insights and analytics for city planners, transport authorities, and researchers
4. **Premium Features**: Optional paid upgrades including route saving, offline maps, and enhanced real-time updates

## Development Roadmap

### Phase 1: Complete MVP System (Day 1 Implementation)
**Goal**: Implement all three required components in one day

#### Hour 1-2: Database Setup & Foundation
**Goal**: Set up database with all required tables

**Essential Tasks:**
- [ ] **Database Setup**
  - Configure PostgreSQL database connection
  - Run ALL migrations (users, monitored_destinations, alerts tables)
  - Seed sample data for alerts and destinations
  - Test database connection with health check endpoint

- [ ] **Server Foundation**
  - Set up Express server with essential middleware
  - Configure environment variables (.env setup)
  - Add basic error handling and CORS

**Acceptance Criteria:**
- Server starts successfully
- All database tables created and seeded
- Health check endpoint (`GET /api/health`) works

#### Hour 3-4: User Profile & Preferences System
**Goal**: Complete user authentication and profile management

**Essential Tasks:**
- [ ] **Authentication System**
  - User registration endpoint (`POST /api/auth/register`)
  - User login endpoint (`POST /api/auth/login`)
  - JWT token generation and middleware
  - Password hashing with bcrypt

- [ ] **Profile Management**
  - Get profile endpoint (`GET /api/users/profile`)
  - Update profile endpoint (`PUT /api/users/profile`)
  - Password change endpoint (`PUT /api/users/password`)
  - User preferences (notification settings, preferred language)

**Acceptance Criteria:**
- Users can register, login, and manage profiles
- Profile includes name, email, password change capability
- At least 2 preference settings (notifications, language)
- All changes persist to database

#### Hour 5-6: Alerts/Notifications Dashboard
**Goal**: Complete alerts system with database integration

**Essential Tasks:**
- [ ] **Alert Model & Endpoints**
  - Get user alerts endpoint (`GET /api/alerts`)
  - Create alert endpoint (`POST /api/alerts`)
  - Mark alert as read endpoint (`PUT /api/alerts/:id/read`)
  - Get unread count endpoint (`GET /api/alerts/unread-count`)

- [ ] **Alert Features**
  - Display alerts with timestamp, title, status
  - Filter by read/unread status
  - Priority levels (low, medium, high)
  - Sample data seeded for testing

**Acceptance Criteria:**
- Users can view list of alerts from database
- Each alert shows timestamp, title, and status
- Users can mark alerts as read/unread
- Sample alert data is available for testing

#### Hour 7-8: MonitoredDestination CRUD System
**Goal**: Complete destination management with full CRUD operations

**Essential Tasks:**
- [ ] **Destination CRUD Endpoints**
  - Get destinations endpoint (`GET /api/destinations`)
  - Create destination endpoint (`POST /api/destinations`)
  - Update destination endpoint (`PUT /api/destinations/:id`)
  - Delete destination endpoint (`DELETE /api/destinations/:id`)

- [ ] **Destination Features**
  - Fields: id, location, riskLevel (1-5), lastChecked timestamp
  - User-specific destinations (linked to authenticated user)
  - Input validation for all fields
  - Search/filter capabilities

**Acceptance Criteria:**
- Full CRUD operations for MonitoredDestination entity
- All fields properly validated and persisted
- Users can only manage their own destinations
- Risk level validation (1-5 scale)
- Last checked timestamp updates automatically

## Day 1 Complete MVP Deliverables

### **Component 1: User Profile & Preferences**
**Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile (name, email, preferences)
- `PUT /api/users/password` - Change password

**Features:**
- View & edit name, email, password
- Notification settings (enabled/disabled)
- Preferred language selection (en, af, zu, xh)
- All changes persist to database

### **Component 2: Alerts/Notifications Dashboard**
**Endpoints:**
- `GET /api/alerts` - Get user alerts with pagination
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/:id/read` - Mark alert as read
- `GET /api/alerts/unread-count` - Get unread alerts count

**Features:**
- Display alerts with timestamp, title, status
- Filter by read/unread status
- Priority levels (low, medium, high)
- Sample seeded data for testing

### **Component 3: MonitoredDestination CRUD**
**Endpoints:**
- `GET /api/destinations` - List user destinations
- `POST /api/destinations` - Create new destination
- `GET /api/destinations/:id` - Get specific destination
- `PUT /api/destinations/:id` - Update destination
- `DELETE /api/destinations/:id` - Delete destination

**Features:**
- Full CRUD operations for MonitoredDestination entity
- Fields: id, location, riskLevel (1-5), lastChecked timestamp
- User-specific destinations (authenticated access)
- Input validation and error handling

### **Core System Features:**
- Secure JWT-based authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Error handling middleware
- PostgreSQL database integration
- Sample data seeding

### **Database Tables Implemented:**
- `users` - User accounts and preferences
- `alerts` - Notifications and alerts
- `monitored_destinations` - User's monitored locations

### Future Development (Post Day 1)

#### Day 2-3: Enhanced User Features
- Password change functionality
- User preferences (language, notifications)
- Comprehensive input validation
- Rate limiting and security enhancements

#### Week 2: Destination Management System
- Monitored destinations CRUD operations
- Location validation and risk assessment
- User-specific destination filtering

#### Week 3: Alert & Notification System
- Alert creation and management
- Priority-based alert system
- Alert status tracking (read/unread)

#### Week 4: Integration & Polish
- Frontend integration
- Performance optimization
- Production deployment
- Comprehensive testing

## Day 1 Success Criteria

✅ **Component 1 Complete**: User Profile & Preferences with name, email, password, and 2+ settings
✅ **Component 2 Complete**: Alerts Dashboard displaying database records with timestamp, title, status
✅ **Component 3 Complete**: MonitoredDestination CRUD with full Create, Read, Update, Delete operations
✅ **Database Integration**: All 3 tables (users, alerts, monitored_destinations) working
✅ **Authentication**: Secure JWT-based auth protecting all endpoints
✅ **API Complete**: 15+ working REST endpoints ready for frontend integration

## Required API Endpoints (15 total)

### Authentication (2 endpoints)
- `POST /api/auth/register`
- `POST /api/auth/login`

### User Profile & Preferences (3 endpoints)
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `PUT /api/users/password`

### Alerts Dashboard (4 endpoints)
- `GET /api/alerts`
- `POST /api/alerts`
- `PUT /api/alerts/:id/read`
- `GET /api/alerts/unread-count`

### MonitoredDestination CRUD (5 endpoints)
- `GET /api/destinations`
- `POST /api/destinations`
- `GET /api/destinations/:id`
- `PUT /api/destinations/:id`
- `DELETE /api/destinations/:id`

### System (1 endpoint)
- `GET /api/health`

## Getting Started Today

1. **Setup** (30 min): `npm install`, database setup, run all migrations and seeds
2. **Implement** (7 hours): Follow the hour-by-hour roadmap for all 3 components
3. **Test** (30 min): Manual testing of all 15 endpoints

This comprehensive Day 1 roadmap delivers all three required components with full backend functionality.

## Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, questions, or suggestions:
- Email: support@sataxitracker.co.za
- Issues: [GitHub Issues](https://github.com/your-org/sa-taxi-tracker/issues)
- Documentation: [Wiki](https://github.com/your-org/sa-taxi-tracker/wiki)

## Acknowledgments

- South African taxi industry stakeholders
- Community contributors and beta testers
- Local transportation authorities
- Open source contributors

---

**SA Taxi Solutions** - Transforming urban mobility through technology and community collaboration