#!/bin/bash

# SkillHub Monolithic Deployment Script
# This script deploys the entire application stack

set -e

echo "🚀 Starting SkillHub Monolithic Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker and Docker Compose are installed
check_dependencies() {
    print_status "Checking dependencies..."

    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    print_status "Dependencies check passed!"
}

# Build and start services
deploy_services() {
    print_status "Building and starting services..."

    # Build all services
    docker-compose build

    # Start services in detached mode
    docker-compose up -d

    print_status "Services started successfully!"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."

    # Wait for database
    print_status "Waiting for PostgreSQL..."
    until docker-compose exec -T postgres pg_isready -U skillhub_user -d skillhub; do
        sleep 2
    done

    # Wait for Redis
    print_status "Waiting for Redis..."
    until docker-compose exec -T redis redis-cli ping; do
        sleep 2
    done

    # Wait for RabbitMQ
    print_status "Waiting for RabbitMQ..."
    until docker-compose exec -T rabbitmq rabbitmq-diagnostics ping; do
        sleep 2
    done

    print_status "All services are ready!"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."

    # Wait a bit for the backend to be ready
    sleep 10

    # Run database setup
    docker-compose exec -T backend npm run db:push

    print_status "Database migrations completed!"
}

# Check service health
check_health() {
    print_status "Checking service health..."

    # Check backend health
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        print_status "Backend is healthy"
    else
        print_warning "Backend health check failed"
    fi

    # Check frontend
    if curl -f http://localhost:3001 > /dev/null 2>&1; then
        print_status "Frontend is healthy"
    else
        print_warning "Frontend health check failed"
    fi

    # Check admin panel
    if curl -f http://localhost:3002 > /dev/null 2>&1; then
        print_status "Admin panel is healthy"
    else
        print_warning "Admin panel health check failed"
    fi
}

# Show service URLs
show_urls() {
    echo ""
    print_status "🎉 Deployment completed successfully!"
    echo ""
    echo "Service URLs:"
    echo "  📊 Backend API:     http://localhost:3000"
    echo "  🎓 Frontend App:    http://localhost:3001"
    echo "  🔧 Admin Panel:     http://localhost:3002"
    echo "  🐰 RabbitMQ Admin:  http://localhost:15672"
    echo ""
    echo "Default credentials:"
    echo "  RabbitMQ: skillhub_user / skillhub_password"
    echo ""
    print_status "You can now access the application!"
}

# Main deployment function
main() {
    print_status "Starting SkillHub Monolithic deployment..."

    check_dependencies
    deploy_services
    wait_for_services
    run_migrations
    check_health
    show_urls
}

# Handle script arguments
case "${1:-}" in
    "stop")
        print_status "Stopping services..."
        docker-compose down
        print_status "Services stopped!"
        ;;
    "restart")
        print_status "Restarting services..."
        docker-compose restart
        print_status "Services restarted!"
        ;;
    "logs")
        print_status "Showing logs..."
        docker-compose logs -f
        ;;
    "clean")
        print_status "Cleaning up..."
        docker-compose down -v
        docker system prune -f
        print_status "Cleanup completed!"
        ;;
    *)
        main
        ;;
esac
