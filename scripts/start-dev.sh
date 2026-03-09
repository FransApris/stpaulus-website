#!/bin/bash

# Script: Auto-start MySQL and Dev Server
# Usage: npm run dev:auto

echo "🔍 Checking MySQL status..."

# Check if MySQL is running
if ! pgrep -x mysqld > /dev/null; then
    echo "🚀 Starting MySQL server..."
    # Use echo to pass password to sudo (suppress password prompt)
    echo "112233" | sudo -S /usr/local/mysql/support-files/mysql.server start 2>/dev/null
    
    # Wait for MySQL to be ready
    echo "⏳ Waiting for MySQL to be ready..."
    for i in {1..30}; do
        if mysql -u root -ppressgk31 -e "SELECT 1" > /dev/null 2>&1; then
            echo "✅ MySQL is ready!"
            break
        fi
        sleep 1
        if [ $i -eq 30 ]; then
            echo "❌ MySQL failed to start after 30 seconds"
            exit 1
        fi
    done
else
    echo "✅ MySQL is already running"
fi

echo "🚀 Starting Nuxt dev server..."
NODE_OPTIONS="--no-deprecation" npx nuxt dev
