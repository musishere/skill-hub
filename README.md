# SkillHub Monolithic LMS

A comprehensive Learning Management System (LMS) built as a monolithic application with separate backend, frontend, and admin panel components.

## 🏗️ Architecture

This is a monolithic application with three main components:

- **Backend** (`/backend`) - Fastify API server with TypeScript
- **Frontend** (`/frontend`) - Next.js React application for students/instructors
- **Admin Panel** (`/admin-panel`) - Next.js React application for administrators

## 📁 Project Structure

```
monolithic/
├── backend/           # Fastify API server
├── frontend/          # Next.js student/instructor app
├── admin-panel/       # Next.js admin dashboard
├── docs/             # Documentation
├── tests/            # Test files
├── *.sql             # Database scripts
└── package.json      # Root package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis
- RabbitMQ

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` in each component directory
   - Configure database, Redis, and RabbitMQ connections

3. **Set up the database:**
   ```bash
   npm run db:push
   ```

### Development

**Start all services in development mode:**
```bash
npm run dev
```

This will start:
- Backend API on port 3000
- Frontend on port 3001
- Admin Panel on port 3002

### Individual Development

**Backend only:**
```bash
npm run dev:backend
```

**Frontend only:**
```bash
npm run dev:frontend
```

**Admin Panel only:**
```bash
npm run dev:admin
```

### Production

**Build all applications:**
```bash
npm run build
```

**Start all services:**
```bash
npm run start
```

## 🛠️ Available Scripts

### Root Level
- `npm run dev` - Start all services in development
- `npm run build` - Build all applications
- `npm run start` - Start all services in production
- `npm run install:all` - Install dependencies for all components
- `npm run lint` - Lint all components
- `npm run test` - Run tests for all components

### Backend
- `npm run dev:backend` - Start backend in development
- `npm run build:backend` - Build backend
- `npm run start:backend` - Start backend in production
- `npm run db:push` - Push database schema
- `npm run db:generate` - Generate database migrations

### Frontend
- `npm run dev:frontend` - Start frontend in development
- `npm run build:frontend` - Build frontend
- `npm run start:frontend` - Start frontend in production

### Admin Panel
- `npm run dev:admin` - Start admin panel in development
- `npm run build:admin` - Build admin panel
- `npm run start:admin` - Start admin panel in production

## 🔧 Configuration

Each component has its own configuration:

- **Backend**: Environment variables in `backend/.env`
- **Frontend**: Environment variables in `frontend/.env.local`
- **Admin Panel**: Environment variables in `admin-panel/.env.local`

## 📊 Database

The application uses PostgreSQL with Drizzle ORM. Database scripts are available in the root directory:

- `database-setup-sql.sql` - Initial database setup
- `safe-database-setup.sql` - Safe database setup
- `add-test-data-for-my-learning.sql` - Test data insertion

## 🧪 Testing

Run tests for all components:
```bash
npm run test
```

Run tests for specific components:
```bash
npm run test:backend
npm run test:frontend
```

## 📚 Documentation

See the `docs/` directory for detailed documentation about:
- API endpoints
- Database schema
- Component architecture
- Deployment guides

## 🔒 Security

- JWT authentication
- Role-based access control
- Rate limiting
- CORS configuration
- Helmet security headers

## 🚀 Deployment

The application can be deployed as:
1. **Monolithic deployment** - All services on same server
2. **Containerized deployment** - Using Docker
3. **Microservices deployment** - Each component separately

## 📝 License

ISC License
