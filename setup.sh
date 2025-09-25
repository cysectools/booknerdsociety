#!/bin/bash

echo "🚀 Setting up BookNerdSociety Professional Platform..."
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd apps/frontend
npm install
cd ../..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd apps/backend
npm install
cd ../..

# Create environment files
echo "⚙️  Setting up environment files..."

# Backend environment
if [ ! -f "apps/backend/.env" ]; then
    cp apps/backend/env.example apps/backend/.env
    echo "✅ Created apps/backend/.env"
    echo "⚠️  Please edit apps/backend/.env with your configuration"
else
    echo "✅ apps/backend/.env already exists"
fi

# Frontend environment
if [ ! -f "apps/frontend/.env" ]; then
    cat > apps/frontend/.env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_BOOKS_API_KEY=your-google-books-api-key-here
EOF
    echo "✅ Created apps/frontend/.env"
    echo "⚠️  Please edit apps/frontend/.env with your Google Books API key"
else
    echo "✅ apps/frontend/.env already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit apps/backend/.env with your MongoDB URI and JWT secret"
echo "2. Edit apps/frontend/.env with your Google Books API key"
echo "3. Start MongoDB (if using local instance)"
echo "4. Run 'npm run dev' to start both frontend and backend"
echo ""
echo "📚 Documentation: See README.md for detailed instructions"
echo ""
echo "Happy coding! 🚀"
