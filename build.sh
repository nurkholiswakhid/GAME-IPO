#!/bin/bash
# Railway deploy script

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "🗄️ Running database migrations..."
npx prisma migrate deploy || npx prisma db push

echo "🌱 Seeding database..."
npm run prisma:seed || true

echo "✅ Backend ready!"
