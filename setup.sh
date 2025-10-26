#!/bin/bash

echo "🚀 AI Interview Prep - Quick Start Script"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+ first."
    exit 1
fi

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Setup Backend
echo "📦 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Created Python virtual environment"
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -q -r requirements.txt
echo "✅ Installed Python dependencies"

# Check for .env file
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  No .env file found!"
    echo "Please create a .env file with your ANTHROPIC_API_KEY"
    echo "You can copy .env.example and fill in your API key:"
    echo ""
    echo "  cp .env.example .env"
    echo "  # Then edit .env and add your API key"
    echo ""
    read -p "Do you want to enter your API key now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your Anthropic API key: " api_key
        echo "ANTHROPIC_API_KEY=$api_key" > .env
        echo "✅ Created .env file with API key"
    else
        echo "⚠️  Remember to create .env before running the backend!"
    fi
fi

cd ..

# Setup Frontend
echo ""
echo "📦 Setting up frontend..."
cd frontend

# Install dependencies
npm install
echo "✅ Installed Node dependencies"

cd ..

echo ""
echo "=========================================="
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend (in terminal 1):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python main.py"
echo ""
echo "2. Start the frontend (in terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "📚 For more information, check README.md"
echo "=========================================="
