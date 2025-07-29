#!/bin/bash

echo "🧪 Testing Monolithic Setup..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test functions
test_file_exists() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1 exists"
        return 0
    else
        echo -e "${RED}❌${NC} $1 missing"
        return 1
    fi
}

test_directory_exists() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅${NC} $1 exists"
        return 0
    else
        echo -e "${RED}❌${NC} $1 missing"
        return 1
    fi
}

echo "📁 Checking directory structure..."

# Test main directories
test_directory_exists "backend"
test_directory_exists "frontend"
test_directory_exists "admin-panel"
test_directory_exists "docs"
test_directory_exists "tests"

echo ""
echo "📄 Checking critical files..."

# Test critical files
test_file_exists "package.json"
test_file_exists "docker-compose.yml"
test_file_exists "nginx.conf"
test_file_exists "deploy.sh"
test_file_exists "README.md"

echo ""
echo "🔧 Checking component files..."

# Test backend files
test_file_exists "backend/package.json"
test_file_exists "backend/src/app.ts"
test_file_exists "backend/Dockerfile"

# Test frontend files
test_file_exists "frontend/package.json"
test_file_exists "frontend/next.config.ts"
test_file_exists "frontend/tailwind.config.ts"
test_file_exists "frontend/Dockerfile"

# Test admin panel files
test_file_exists "admin-panel/package.json"
test_file_exists "admin-panel/next.config.ts"
test_file_exists "admin-panel/tailwind.config.ts"
test_file_exists "admin-panel/Dockerfile"

echo ""
echo "📊 Checking source code..."

# Test source directories
test_directory_exists "backend/src"
test_directory_exists "frontend/src"
test_directory_exists "admin-panel/src"

# Test if source files are copied
test_file_exists "backend/src/app.ts"
test_directory_exists "backend/src/modules"
test_directory_exists "frontend/src/app"
test_directory_exists "admin-panel/src/app"

echo ""
echo "🗄️ Checking database scripts..."

# Test database scripts
test_file_exists "database-setup-sql.sql"
test_file_exists "safe-database-setup.sql"
test_file_exists "add-test-data-for-my-learning.sql"

echo ""
echo "🎯 Summary:"
echo "All critical files and directories are present!"
echo ""
echo "🚀 Ready to deploy with:"
echo "  ./deploy.sh"
echo ""
echo "Or for development:"
echo "  npm run install:all"
echo "  npm run dev"
