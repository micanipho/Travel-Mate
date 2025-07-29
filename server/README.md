# Travel Mate Backend

Backend API for the Travel Mate application - a community-driven taxi tracking system for South Africa.

## Project Structure

```
server/
├── controllers/          # Route handlers
│   ├── AuthController.js
│   ├── UserController.js
│   ├── DestinationController.js
│   └── AlertController.js
├── middleware/           # Authentication, validation, error handling
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── models/              # Database models and queries
│   ├── User.js
│   ├── MonitoredDestination.js
│   └── Alert.js
├── routes/              # API route definitions
│   ├── auth.js
│   ├── users.js
│   ├── destinations.js
│   └── alerts.js
├── services/            # Business logic
│   ├── UserService.js
│   ├── DestinationService.js
│   └── AlertService.js
├── migrations/          # Database migration files
│   ├── 001_create_users_table.sql
│   ├── 002_create_monitored_destinations_table.sql
│   └── 003_create_alerts_table.sql
├── seeds/               # Sample data for testing
│   ├── 001_users_seed.sql
│   ├── 002_destinations_seed.sql
│   └── 003_alerts_seed.sql
├── tests/               # Test suites
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── config/              # Database and app configuration
│   └── database.js
├── utils/               # Helper functions
│   ├── helpers.js
│   └── logger.js
├── scripts/             # Database scripts
│   ├── createDatabase.js
│   ├── migrate.js
│   ├── seed.js
│   └── rollback.js
├── server.js            # Main application entry point
├── package.json         # Dependencies and scripts
├── .env.example         # Environment variables template
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Create and setup database:
```bash
npm run db:create
npm run db:migrate
npm run db:seed
```

4. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests
- `npm run test:integration` - Run integration tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:coverage` - Run tests with coverage
- `npm run db:create` - Create database
- `npm run db:migrate` - Run migrations
- `npm run db:rollback` - Rollback last migration
- `npm run db:seed` - Seed sample data
- `npm run db:reset` - Reset database (drop + recreate + migrate + seed)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify token

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update current user profile
- `PUT /api/users/password` - Update password

### Destinations
- `GET /api/destinations` - Get user destinations
- `POST /api/destinations` - Create new destination
- `GET /api/destinations/:id` - Get specific destination
- `PUT /api/destinations/:id` - Update destination
- `DELETE /api/destinations/:id` - Delete destination

### Alerts
- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/:id/read` - Mark alert as read
- `DELETE /api/alerts/:id` - Delete alert

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts and profiles
- `monitored_destinations` - User's monitored locations
- `alerts` - Notifications and alerts for users

## Development Notes

This is a basic folder structure with placeholder implementations. Each file contains TODO comments indicating where functionality needs to be implemented.

## License

MIT License
