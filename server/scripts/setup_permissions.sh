#!/bin/bash

# Database Permission Setup Script for Travel Mate
# This script sets up the necessary database permissions for the application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Travel Mate Database Permission Setup${NC}"
echo "========================================"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ Error: .env file not found${NC}"
    echo -e "${YELLOW}Please copy .env.example to .env and configure your database settings${NC}"
    echo "Run: cp .env.example .env"
    exit 1
fi

# Load environment variables
echo -e "${BLUE}📋 Loading environment variables...${NC}"
source .env

# Check if required variables are set
if [ -z "$DB_NAME" ] || [ -z "$DB_USER" ]; then
    echo -e "${RED}❌ Error: DB_NAME and DB_USER must be set in .env file${NC}"
    echo "Please check your .env file configuration"
    exit 1
fi

echo -e "${GREEN}✓ Environment variables loaded${NC}"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Check if PostgreSQL is accessible
echo -e "${BLUE}🔍 Checking PostgreSQL access...${NC}"
if ! sudo -u postgres psql -c '\q' 2>/dev/null; then
    echo -e "${RED}❌ Error: Cannot access PostgreSQL as postgres user${NC}"
    echo "Please ensure PostgreSQL is running and you have sudo access"
    exit 1
fi

echo -e "${GREEN}✓ PostgreSQL access confirmed${NC}"
echo ""

# Grant permissions
echo -e "${BLUE}🔐 Setting up database permissions...${NC}"

echo "  Granting schema privileges..."
sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON SCHEMA public TO $DB_USER;" || {
    echo -e "${RED}❌ Failed to grant schema privileges${NC}"
    exit 1
}

echo "  Granting table privileges..."
sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;" || {
    echo -e "${RED}❌ Failed to grant table privileges${NC}"
    exit 1
}

echo "  Granting sequence privileges..."
sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;" || {
    echo -e "${RED}❌ Failed to grant sequence privileges${NC}"
    exit 1
}

echo "  Setting default table privileges..."
sudo -u postgres psql -d "$DB_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;" || {
    echo -e "${RED}❌ Failed to set default table privileges${NC}"
    exit 1
}

echo "  Setting default sequence privileges..."
sudo -u postgres psql -d "$DB_NAME" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;" || {
    echo -e "${RED}❌ Failed to set default sequence privileges${NC}"
    exit 1
}

echo ""
echo -e "${GREEN}🎉 Database permissions setup completed successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Run migrations: npm run db:migrate"
echo "2. Run seeding: npm run db:seed"
echo ""
