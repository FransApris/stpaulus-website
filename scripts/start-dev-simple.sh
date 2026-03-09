#!/bin/bash

# Simple dev script - assumes MySQL is already running
# No password required!

echo "🔍 Checking MySQL connection..."

# Check if MySQL is accessible
if mysql -u root -p"$(grep MYSQL_PASSWORD .env | cut -d= -f2)" -e "SELECT 1;" &>/dev/null; then
  echo "✅ MySQL is running and accessible"
else
  echo ""
  echo "⚠️  MySQL is not running or not accessible"
  echo ""
  echo "📌 Please start MySQL manually:"
  echo "   1. Open System Preferences"
  echo "   2. Go to MySQL"
  echo "   3. Click 'Start MySQL Server'"
  echo ""
  echo "   OR run this command once:"
  echo "   sudo /usr/local/mysql/support-files/mysql.server start"
  echo ""
  exit 1
fi

echo ""
echo "🚀 Starting Nuxt dev server..."
npm run dev
