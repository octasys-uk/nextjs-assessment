#!/bin/bash

echo "🚀 Setting up AI App Builder Assessment..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found!"
    echo "📝 Copying .env.example to .env..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env and add your credentials before continuing!"
    echo "   - DATABASE_URL"
    echo "   - SUPABASE credentials"
    echo "   - OPENAI_API_KEY"
    echo ""
    echo "Press Enter after you've configured .env, or Ctrl+C to exit..."
    read
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed!"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Prisma generate failed!"
    exit 1
fi
echo "✅ Prisma client generated"
echo ""

# Push schema to database
echo "💾 Setting up database..."
npx prisma db push
if [ $? -ne 0 ]; then
    echo "❌ Database push failed!"
    echo "   Check your DATABASE_URL in .env"
    exit 1
fi
echo "✅ Database schema created"
echo ""

# Seed database
echo "🌱 Seeding database..."
npm run db:seed
if [ $? -ne 0 ]; then
    echo "❌ Database seeding failed!"
    exit 1
fi
echo "✅ Database seeded"
echo ""

echo "✅ Setup complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 Next steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. 📖 Read ASSESSMENT.md carefully (REQUIRED!)"
echo "2. 🚀 Start the dev server: npm run dev"
echo "3. 🌐 Open http://localhost:3000"
echo "4. 🔍 Begin identifying and fixing issues!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Important:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "• Document your fixes in SOLUTIONS.md"
echo "• Prioritize P0 (Critical) issues first"
echo "• Minimum 6 out of 10 issues must be fixed"
echo "• Time limit: 3 hours"
echo ""
echo "🧪 Test tokens (use in browser localStorage):"
echo "   test-token-1 (test@example.com)"
echo "   test-token-2 (john@example.com)"
echo ""
echo "Good luck! 🍀"
echo ""
