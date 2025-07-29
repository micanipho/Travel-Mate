# Travel Mate

**Enhancing urban mobility through community-driven taxi information and support**

> **Development Status**: This project is currently in active development. The backend API is fully functional with authentication, user management, alerts, and destinations features. The frontend is being built with React and TypeScript.

## Overview

SA Taxi Tracker is a community-driven mobile application designed to improve the taxi commuting experience in South Africa by providing real-time information, route tracking, and community-based data sharing. The platform addresses common challenges faced by taxi commuters including unreliable schedules, lack of real-time updates, and difficulty finding available taxis.

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

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Forms**: React Hook Form with Zod validation

### Backend
- **Runtime**: Node.js (v22+)
- **Framework**: Express.js
- **Database**: PostgreSQL with raw SQL queries
- **Authentication**: JWT with bcryptjs
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest, Supertest

## Quick Start

For developers who want to get up and running quickly:

```bash
# 1. Clone and install
git clone https://github.com/your-org/travel-mate.git
cd travel-mate
npm install
cd server && npm install && cd ..

# 2. Set up database (PostgreSQL must be installed)
createdb travel_mate_db
cd server
cp .env.example .env
# Edit .env with your database credentials
npm run db:migrate
npm run db:seed

# 3. Start development servers
cd ..
npm run dev:all
```

Visit `http://localhost:5173` for the frontend and `http://localhost:3000/api/health` to verify the backend.

## Getting Started

### Prerequisites

- Node.js (v22 or higher)
- npm (v10 or higher)
- PostgreSQL (v12 or higher)
- Git

### PostgreSQL Installation

#### Ubuntu/Debian Systems

1. **Update package list**
```bash
sudo apt update
```

2. **Install PostgreSQL and additional utilities**
```bash
sudo apt install postgresql postgresql-contrib -y
```

3. **Start and enable PostgreSQL service**
```bash
# Start the service
sudo systemctl start postgresql

# Enable auto-start on boot
sudo systemctl enable postgresql
```

4. **Verify installation**
```bash
# Check service status
sudo systemctl status postgresql

# Check PostgreSQL version
psql --version

# Test database connection
sudo -u postgres psql -c "SELECT version();"
```

#### macOS Systems

1. **Using Homebrew (recommended)**
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@16

# Start PostgreSQL service
brew services start postgresql@16
```

2. **Using PostgreSQL.app**
- Download from [PostgreSQL.app](https://postgresapp.com/)
- Install and launch the application
- Add PostgreSQL to your PATH in `~/.zshrc` or `~/.bash_profile`:
```bash
export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"
```

#### Windows Systems

1. **Download PostgreSQL installer**
- Visit [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
- Download the installer for your Windows version

2. **Run the installer**
- Follow the installation wizard
- Remember the password you set for the `postgres` user
- Default port is 5432 (keep this unless you have conflicts)

3. **Verify installation**
- Open Command Prompt or PowerShell
- Run: `psql --version`

#### Post-Installation Setup

1. **Create a database user for development**
```bash
# Switch to postgres user and create a new user
sudo -u postgres createuser --interactive --pwprompt your_username

# Or create user with specific privileges
sudo -u postgres psql -c "CREATE USER your_username WITH PASSWORD 'your_password' CREATEDB;"
```

2. **Create the project database**
```bash
# Create database for the project
sudo -u postgres createdb travel_mate_db

# Or create with specific owner
sudo -u postgres createdb -O your_username travel_mate_db
```

3. **Set up authentication (Ubuntu/Debian)**
```bash
# Edit PostgreSQL configuration (optional)
sudo nano /etc/postgresql/16/main/pg_hba.conf

# Change authentication method if needed (for development)
# Find the line: local   all             all                                     peer
# Change to:     local   all             all                                     md5
```

4. **Restart PostgreSQL after configuration changes**
```bash
sudo systemctl restart postgresql
```

#### Troubleshooting

**Connection Issues:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-16-main.log

# Test connection with specific user
psql -U your_username -h localhost -d travel_mate_db
```

**Permission Issues:**
```bash
# Reset postgres user password
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'new_password';"

# Grant privileges to your user
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE travel_mate_db TO your_username;"
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-org/travel-mate.git
cd travel-mate
```

2. Install dependencies
```bash
# Install all dependencies (both frontend and backend)
npm install

# Install backend-specific dependencies
cd server
npm install
cd ..
```

3. Database Setup

**Note:** Make sure PostgreSQL is installed and running (see [PostgreSQL Installation](#postgresql-installation) section above).

```bash
# Create PostgreSQL database (if not created during PostgreSQL setup)
createdb travel_mate_db

# Or using psql
psql -U postgres -c "CREATE DATABASE travel_mate_db;"

# Navigate to server directory for database operations
cd server

# Run database migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

4. Environment Setup
```bash
# Create environment file in server directory
cd server
cp .env.example .env

# Configure your PostgreSQL connection in server/.env
DATABASE_URL=postgresql://username:password@localhost:5432/travel_mate_db
JWT_SECRET=your_jwt_secret_here
PORT=3000
NODE_ENV=development

# Example with default postgres user:
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/travel_mate_db
```

5. Start the application
```bash
# Start both frontend and backend (from root directory)
npm run dev:all

# Or start them separately:
# Start frontend only
npm run dev

# Start backend only (from server directory)
cd server && npm run dev
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
│   │   ├── ui/      # Radix UI component wrappers
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Hero.tsx
│   ├── pages/       # Main application pages
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignUpPage.tsx
│   │   ├── Dashboard.tsx
│   │   └── ProfilePage.tsx
│   ├── contexts/    # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utilities and API client
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── queryClient.ts
│   └── main.tsx     # Application entry point
├── index.html
├── vite.config.ts
└── tailwind.config.ts
```

## Current Implementation Status

### ✅ Completed Features

#### Authentication & Authorization
- JWT-based authentication system with bcryptjs password hashing
- User registration and login endpoints
- Protected routes with middleware authentication
- Token verification and refresh functionality

#### User Profile Management
- **Endpoints**: `/api/users/profile`, `/api/users/password`
- **Features**: View/edit name, email, notification settings, preferred language
- **Security**: Password change with current password verification
- **Database**: Full persistence with validation and unique email constraints

#### Alerts/Notifications System
- **Endpoints**: `/api/alerts/*` (8 endpoints total)
- **Features**:
  - Create, read, update, delete alerts
  - Mark alerts as read/unread (individual and bulk)
  - Get unread count for dashboard badges
  - Pagination support for large alert lists
- **Database**: Alert records with timestamp, title, message, status, and priority

#### Monitored Destinations CRUD
- **Endpoints**: `/api/destinations/*` (5 endpoints total)
- **Entity**: MonitoredDestination with full CRUD operations
- **Fields**:
  - `id`: Unique identifier
  - `location`: Destination name/address
  - `risk_level`: Safety/reliability rating (1-5 scale)
  - `last_checked`: Last update timestamp
  - `latitude/longitude`: GPS coordinates
- **Security**: Users can only manage their own destinations

#### Database Integration
- PostgreSQL database with proper schema design
- Raw SQL queries for optimal performance
- Health-check endpoint: `GET /api/health`
- Complete migrations and seeding scripts
- Three core tables: users, alerts, monitored_destinations

#### Security & Middleware
- Helmet for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation with express-validator
- Comprehensive error handling middleware
- Request logging with Morgan

### 🚧 In Development

#### Frontend Implementation
- React 18 with TypeScript and Vite
- Radix UI components with Tailwind CSS
- Authentication context and protected routes
- Basic pages: Home, Login, Signup, Dashboard, Profile
- API integration with TanStack Query

### 📋 Planned Features
- Real-time notifications with WebSocket
- Interactive mapping with route visualization
- Community feedback and validation system
- Mobile-responsive design improvements
- Advanced search and filtering
- Data analytics dashboard

## API Documentation

### Authentication Endpoints
```
POST /api/auth/register  # User registration
POST /api/auth/login     # User login
POST /api/auth/logout    # User logout
GET  /api/auth/verify    # Token verification
POST /api/auth/refresh   # Refresh token
```

### User Management
```
GET    /api/users/profile      # Get user profile
PUT    /api/users/profile      # Update user profile
PUT    /api/users/password     # Update password
GET    /api/users              # List users (admin)
GET    /api/users/:id          # Get user by ID (admin)
DELETE /api/users/:id          # Delete user (admin)
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
GET    /api/alerts                 # Get user alerts (with pagination)
POST   /api/alerts                 # Create new alert
GET    /api/alerts/unread-count    # Get unread alerts count
PUT    /api/alerts/mark-all-read   # Mark all alerts as read
GET    /api/alerts/:id             # Get specific alert
PUT    /api/alerts/:id/read        # Mark alert as read
PUT    /api/alerts/:id/unread      # Mark alert as unread
DELETE /api/alerts/:id             # Delete alert
```

### System Health
```
GET    /api/health                 # Health check endpoint
```

### Database Commands
```bash
# Navigate to server directory first
cd server

# Database operations
npm run db:create     # Create database
npm run db:migrate    # Run migrations
npm run db:rollback   # Rollback last migration
npm run db:seed       # Seed sample data
npm run db:reset      # Reset database (create + migrate + seed)
```

### Development Commands
```bash
# Frontend development (from root)
npm run dev           # Start Vite dev server
npm run build         # Build for production

# Backend development (from server directory)
npm run dev           # Start with nodemon
npm run start         # Start production server

# Full stack development (from root)
npm run dev:all       # Start both frontend and backend
```

## Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables
Required environment variables for production:

**Server (.env in server directory):**
```
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secure-jwt-secret
PORT=3000
```

### Docker Support
```bash
# Build and run with Docker (if Dockerfile is available)
docker build -t travel-mate .
docker run -p 3000:3000 -p 5173:5173 travel-mate
```

## Testing

### Running Tests
```bash
# Navigate to server directory for backend tests
cd server

# Run all tests
npm test

# Run specific test suites
npm run test:unit         # Unit tests
npm run test:integration  # Integration tests
npm run test:e2e         # End-to-end tests

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint
npm run lint:fix
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

For detailed development phases, implementation timelines, and deliverables, see [ROADMAP.md](ROADMAP.md).

## Contributing

We welcome contributions from the community!

### Development Setup
1. Fork the repository
2. Follow the [Quick Start](#quick-start) guide
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Add tests for new functionality (backend tests in `server/tests/`)
6. Ensure all tests pass: `cd server && npm test`
7. Ensure code follows style guidelines: `npm run lint`
8. Commit your changes: `git commit -m "Add your feature"`
9. Push to your fork: `git push origin feature/your-feature-name`
10. Submit a pull request

### Code Style
- Backend: Follow ESLint configuration in `server/.eslintrc.js`
- Frontend: TypeScript with Prettier formatting
- Database: Use migrations for schema changes
- API: Follow RESTful conventions and include proper error handling

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, questions, or suggestions:
- Email: support@travelmate.co.za
- Issues: [GitHub Issues](https://github.com/your-org/travel-mate/issues)
- Documentation: [Wiki](https://github.com/your-org/travel-mate/wiki)

## Acknowledgments

- South African taxi industry stakeholders
- Community contributors and beta testers
- Local transportation authorities
- Open source contributors

---

**Travel Mate** - Transforming urban mobility through technology and community collaboration