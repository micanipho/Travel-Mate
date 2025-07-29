# Travel Mate - Development Roadmap

This document outlines the development phases, implementation timelines, and deliverables for the Travel Mate project.

## Phase 1: Complete MVP System (Day 1 Implementation - Completion by 5:00 PM)
**Goal**: Implement all three required components by 5:00 PM today

### 9:00 AM - 11:00 AM: Database Setup & Foundation
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

### 11:00 AM - 1:00 PM: User Profile & Preferences System
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

### 1:00 PM - 3:00 PM: Alerts/Notifications Dashboard
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

### 3:00 PM - 5:00 PM: MonitoredDestination CRUD System
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

## Future Development (Post Day 1)

### Day 2-3: Enhanced User Features
- Password change functionality
- User preferences (language, notifications)
- Comprehensive input validation
- Rate limiting and security enhancements

### Week 2: Destination Management System
- Monitored destinations CRUD operations
- Location validation and risk assessment
- User-specific destination filtering

### Week 3: Alert & Notification System
- Alert creation and management
- Priority-based alert system
- Alert status tracking (read/unread)

### Week 4: Integration & Polish
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

## Getting Started Today - Complete by 5:00 PM

**Timeline Overview:**
- **8:30 AM - 9:00 AM**: Setup (30 min) - `npm install`, database setup, run all migrations and seeds
- **9:00 AM - 5:00 PM**: Implementation (8 hours) - Follow the time-based roadmap for all 3 components
- **4:30 PM - 5:00 PM**: Final testing (30 min) - Manual testing of all 15 endpoints

**Daily Schedule:**
1. **8:30 AM**: Project setup and environment configuration
2. **9:00 AM**: Database Setup & Foundation phase begins
3. **11:00 AM**: User Profile & Preferences System phase begins
4. **1:00 PM**: Alerts/Notifications Dashboard phase begins
5. **3:00 PM**: MonitoredDestination CRUD System phase begins
6. **4:30 PM**: Final testing and validation
7. **5:00 PM**: Complete MVP delivery with all three required components

This comprehensive Day 1 roadmap delivers all three required components with full backend functionality by 5:00 PM.

---

*For project overview and setup instructions, see [README.md](README.md)*
