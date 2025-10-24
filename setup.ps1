# PowerShell setup script for Windows

Write-Host "🚀 Setting up AI App Builder Assessment..." -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "⚠️  No .env file found!" -ForegroundColor Yellow
    Write-Host "📝 Copying .env.example to .env..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Please edit .env and add your credentials before continuing!" -ForegroundColor Yellow
    Write-Host "   - DATABASE_URL"
    Write-Host "   - SUPABASE credentials"
    Write-Host "   - OPENAI_API_KEY"
    Write-Host ""
    Write-Host "Press Enter after you've configured .env, or Ctrl+C to exit..."
    Read-Host
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma generate failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Prisma client generated" -ForegroundColor Green
Write-Host ""

# Push schema to database
Write-Host "💾 Setting up database..." -ForegroundColor Cyan
npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Database push failed!" -ForegroundColor Red
    Write-Host "   Check your DATABASE_URL in .env"
    exit 1
}
Write-Host "✅ Database schema created" -ForegroundColor Green
Write-Host ""

# Seed database
Write-Host "🌱 Seeding database..." -ForegroundColor Cyan
npm run db:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Database seeding failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Database seeded" -ForegroundColor Green
Write-Host ""

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎯 Next steps:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 📖 Read ASSESSMENT.md carefully (REQUIRED!)"
Write-Host "2. 🚀 Start the dev server: npm run dev"
Write-Host "3. 🌐 Open http://localhost:3000"
Write-Host "4. 🔍 Begin identifying and fixing issues!"
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📝 Important:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "• Document your fixes in SOLUTIONS.md"
Write-Host "• Prioritize P0 (Critical) issues first"
Write-Host "• Minimum 6 out of 10 issues must be fixed"
Write-Host "• Time limit: 3 hours"
Write-Host ""
Write-Host "🧪 Test tokens (use in browser localStorage):"
Write-Host "   test-token-1 (test@example.com)"
Write-Host "   test-token-2 (john@example.com)"
Write-Host ""
Write-Host "Good luck! 🍀" -ForegroundColor Green
Write-Host ""
