#!/bin/bash

# Manual Database Seeding Script
# This script can be used to seed the database manually when Node.js is not available

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database configuration (modify as needed)
DB_NAME="${DB_NAME:-travel_mate}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

echo -e "${BLUE}🌱 Travel Mate Database Seeding Script${NC}"
echo -e "${BLUE}======================================${NC}\n"

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ Error: psql command not found. Please install PostgreSQL client.${NC}"
    exit 1
fi

# Function to execute SQL file
execute_sql_file() {
    local file_path="$1"
    local file_name=$(basename "$file_path")
    
    echo -e "${YELLOW}Executing: $file_name${NC}"
    
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file_path" -q; then
        echo -e "${GREEN}✓ Successfully executed: $file_name${NC}"
        return 0
    else
        echo -e "${RED}✗ Error executing: $file_name${NC}"
        return 1
    fi
}

# Function to display seeding summary
display_summary() {
    echo -e "\n${BLUE}📊 Seeding Summary:${NC}"
    
    # Count users
    USER_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | xargs)
    echo -e "  Users: ${GREEN}$USER_COUNT${NC}"
    
    # Count destinations
    DEST_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM monitored_destinations;" 2>/dev/null | xargs)
    echo -e "  Destinations: ${GREEN}$DEST_COUNT${NC}"
    
    # Count alerts
    ALERT_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM alerts;" 2>/dev/null | xargs)
    echo -e "  Alerts: ${GREEN}$ALERT_COUNT${NC}"
    
    # Alert status breakdown
    echo -e "\n  Alert Status:"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "
        SELECT '    ' || status || ': ' || COUNT(*) 
        FROM alerts 
        GROUP BY status 
        ORDER BY status;
    " 2>/dev/null | while read line; do
        echo -e "${GREEN}$line${NC}"
    done
    
    # Risk level breakdown
    echo -e "\n  Destinations by Risk Level:"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "
        SELECT '    Level ' || risk_level || ': ' || COUNT(*) 
        FROM monitored_destinations 
        GROUP BY risk_level 
        ORDER BY risk_level;
    " 2>/dev/null | while read line; do
        echo -e "${GREEN}$line${NC}"
    done
}

# Main execution
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "User: $DB_USER"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SEEDS_DIR="$SCRIPT_DIR/../seeds"

# Check if seeds directory exists
if [ ! -d "$SEEDS_DIR" ]; then
    echo -e "${RED}❌ Error: Seeds directory not found at $SEEDS_DIR${NC}"
    exit 1
fi

# Get all SQL files in order
SQL_FILES=($(find "$SEEDS_DIR" -name "*.sql" | sort))

if [ ${#SQL_FILES[@]} -eq 0 ]; then
    echo -e "${RED}❌ Error: No SQL seed files found in $SEEDS_DIR${NC}"
    exit 1
fi

echo -e "${BLUE}Found ${#SQL_FILES[@]} seed files:${NC}"
for file in "${SQL_FILES[@]}"; do
    echo "  - $(basename "$file")"
done
echo ""

# Ask for confirmation
read -p "Do you want to proceed with seeding? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Seeding cancelled.${NC}"
    exit 0
fi

# Execute each SQL file
echo -e "\n${BLUE}Starting database seeding...${NC}\n"

FAILED_FILES=()
for file in "${SQL_FILES[@]}"; do
    if ! execute_sql_file "$file"; then
        FAILED_FILES+=("$(basename "$file")")
    fi
    echo ""
done

# Display results
if [ ${#FAILED_FILES[@]} -eq 0 ]; then
    echo -e "${GREEN}🎉 Database seeding completed successfully!${NC}"
    display_summary
else
    echo -e "${RED}💥 Database seeding completed with errors:${NC}"
    for file in "${FAILED_FILES[@]}"; do
        echo -e "${RED}  - $file${NC}"
    done
fi

echo -e "\n${BLUE}Seeding process finished.${NC}"
