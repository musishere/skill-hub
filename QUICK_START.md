# 🚀 Quick Start Guide

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Docker & Docker Compose** - [Download here](https://docs.docker.com/get-docker/)
- **Git** - [Download here](https://git-scm.com/)

## Option 1: Docker Deployment (Recommended)

### 1. Clone and Navigate
```bash
cd monolithic
```

### 2. Deploy with Docker
```bash
./deploy.sh
```

This will:
- ✅ Build all Docker images
- ✅ Start PostgreSQL, Redis, and RabbitMQ
- ✅ Start Backend, Frontend, and Admin Panel
- ✅ Run database migrations
- ✅ Check service health

### 3. Access Your Application
- **Frontend App**: http://localhost:3001
- **Admin Panel**: http://localhost:3002
- **Backend API**: http://localhost:3000
- **RabbitMQ Admin**: http://localhost:15672

### 4. Useful Docker Commands
```bash
# View logs
./deploy.sh logs

# Stop services
./deploy.sh stop

# Restart services
./deploy.sh restart

# Clean up everything
./deploy.sh clean
```

## Option 2: Local Development

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Set Up Environment Variables

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://username:password@localhost:5432/skillhub
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost:5672
JWT_SECRET=your-secret-key
PORT=3000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Admin Panel** (`admin-panel/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Set Up Database
```bash
# Install PostgreSQL and create database
createdb skillhub

# Run migrations
npm run db:push
```

### 4. Start Development Servers
```bash
# Start all services
npm run dev

# Or start individually:
npm run dev:backend    # Port 3000
npm run dev:frontend   # Port 3001
npm run dev:admin      # Port 3002
```

## 🔧 Configuration

### Database Setup
The application uses PostgreSQL. You can set it up using Docker:

```bash
# Start PostgreSQL with Docker
docker run --name skillhub-postgres \
  -e POSTGRES_DB=skillhub \
  -e POSTGRES_USER=skillhub_user \
  -e POSTGRES_PASSWORD=skillhub_password \
  -p 5432:5432 \
  -d postgres:15
```

### Redis Setup
```bash
# Start Redis with Docker
docker run --name skillhub-redis \
  -p 6379:6379 \
  -d redis:7-alpine
```

### RabbitMQ Setup
```bash
# Start RabbitMQ with Docker
docker run --name skillhub-rabbitmq \
  -e RABBITMQ_DEFAULT_USER=skillhub_user \
  -e RABBITMQ_DEFAULT_PASS=skillhub_password \
  -p 5672:5672 \
  -p 15672:15672 \
  -d rabbitmq:3-management-alpine
```

## 📊 Database Scripts

The application includes several SQL scripts for database setup:

- `database-setup-sql.sql` - Initial database setup
- `safe-database-setup.sql` - Safe database setup
- `add-test-data-for-my-learning.sql` - Test data insertion

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific component tests
npm run test:backend
npm run test:frontend
```

## 🚀 Production Deployment

### Using Docker (Recommended)
```bash
# Build and deploy
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f
```

### Manual Deployment
```bash
# Build all applications
npm run build

# Start production servers
npm run start
```

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find and kill process using port
   lsof -ti:3000 | xargs kill -9
   ```

2. **Database connection failed**
   - Check if PostgreSQL is running
   - Verify connection string in `.env`
   - Ensure database exists

3. **Redis connection failed**
   - Check if Redis is running
   - Verify Redis URL in `.env`

4. **RabbitMQ connection failed**
   - Check if RabbitMQ is running
   - Verify RabbitMQ URL in `.env`

### Health Checks

```bash
# Backend health
curl http://localhost:3000/health

# Frontend health
curl http://localhost:3001

# Admin panel health
curl http://localhost:3002
```

## 📚 Next Steps

1. **Explore the API**: Visit http://localhost:3000/health
2. **Test the Frontend**: Visit http://localhost:3001
3. **Access Admin Panel**: Visit http://localhost:3002
4. **Check Documentation**: See the `docs/` directory
5. **Run Tests**: Execute `npm run test`

## 🆘 Support

If you encounter issues:

1. Check the logs: `./deploy.sh logs`
2. Verify all services are running: `docker-compose ps`
3. Check the documentation in `docs/`
4. Review the troubleshooting section above

---

**Happy coding! 🎉**
