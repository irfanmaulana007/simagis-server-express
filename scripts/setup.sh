#!/bin/bash

# POS & Warehouse API Setup Script
# This script helps set up the development environment

set -e

echo "🚀 Setting up POS & Warehouse API..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
print_status "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version $NODE_VERSION is not supported. Please install Node.js 18 or higher."
    exit 1
fi

print_success "Node.js $(node -v) is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_success "npm $(npm -v) is installed"

# Install dependencies
print_status "Installing dependencies..."
npm install
print_success "Dependencies installed"

# Check if .env file exists
if [ ! -f .env ]; then
    print_status "Creating .env file from template..."
    if [ -f env.example ]; then
        cp env.example .env
        print_success ".env file created from template"
        print_warning "Please update the .env file with your configuration"
    else
        print_error "env.example file not found"
        exit 1
    fi
else
    print_success ".env file already exists"
fi

# Check if Docker is installed (optional)
if command -v docker &> /dev/null; then
    print_success "Docker is installed"

    # Ask if user wants to start development database
    read -p "Do you want to start the development database with Docker? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Starting development database..."
        docker-compose -f docker-compose.dev.yml up -d postgres-dev
        print_success "Development database started"

        # Wait for database to be ready
        print_status "Waiting for database to be ready..."
        sleep 10

        # Update .env file with development database URL
        if grep -q "DATABASE_URL" .env; then
            sed -i.bak 's|DATABASE_URL=.*|DATABASE_URL="postgresql://postgres:postgres@localhost:5433/pos_warehouse_dev_db"|' .env
            print_success "Updated DATABASE_URL in .env file"
        fi
    fi
else
    print_warning "Docker is not installed. You'll need to set up PostgreSQL manually."
fi

# Generate Prisma client
print_status "Generating Prisma client..."
npm run prisma:generate
print_success "Prisma client generated"

# Run migrations (if database is available)
print_status "Running database migrations..."
if npm run prisma:migrate > /dev/null 2>&1; then
    print_success "Database migrations completed"
else
    print_warning "Database migrations failed. Please check your database connection."
fi

# Build the project
print_status "Building the project..."
npm run build
print_success "Project built successfully"

# Run tests
print_status "Running tests..."
if npm test > /dev/null 2>&1; then
    print_success "All tests passed"
else
    print_warning "Some tests failed. Check the test output for details."
fi

echo
print_success "🎉 Setup completed successfully!"
echo
echo "📋 Next steps:"
echo "   1. Update your .env file with the correct configuration"
echo "   2. Run 'npm run dev' to start the development server"
echo "   3. Visit http://localhost:3000/health to verify the API is running"
echo "   4. Check the README.md for API documentation"
echo

if command -v docker &> /dev/null; then
    echo "🐳 Docker commands:"
    echo "   - Start dev database: docker-compose -f docker-compose.dev.yml up -d"
    echo "   - Stop dev database: docker-compose -f docker-compose.dev.yml down"
    echo "   - View database with pgAdmin: http://localhost:5050"
    echo
fi

echo "📚 Useful commands:"
echo "   - npm run dev         # Start development server"
echo "   - npm run build       # Build for production"
echo "   - npm run prisma:studio # Open Prisma Studio"
echo "   - npm test            # Run tests"
echo "   - npm run lint        # Check code style"
echo "   - npm run format      # Format code with Prettier"
echo
