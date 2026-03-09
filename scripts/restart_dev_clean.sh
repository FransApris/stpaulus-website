#!/bin/bash

echo "🔄 Stopping all Node/Nuxt processes..."
pkill -f "nuxt dev"
pkill -f "node.*nuxt"

echo "⏳ Waiting for processes to terminate..."
sleep 2

echo "🗑️  Clearing cache..."
rm -rf .nuxt
rm -rf node_modules/.vite

echo "✨ Starting fresh dev server..."
npm run dev
