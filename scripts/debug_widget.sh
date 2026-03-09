#!/bin/bash

echo "🔍 === DEBUGGING WIDGET ISSUE ==="
echo ""

# Check if server is running
echo "1️⃣ Checking if server is running..."
if lsof -i :3001 > /dev/null 2>&1; then
    echo "   ✅ Server is listening on port 3001"
else
    echo "   ❌ Server is NOT running on port 3001"
    echo "   💡 Run: npm run dev"
    exit 1
fi

echo ""
echo "2️⃣ Testing API Endpoints..."

# Test regular mass schedules
echo "   📋 Regular Mass Schedules:"
REGULAR_RESULT=$(curl -s http://localhost:3001/api/regular-mass-schedules)
if [ -n "$REGULAR_RESULT" ]; then
    REGULAR_COUNT=$(echo "$REGULAR_RESULT" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data) if isinstance(data, list) else 0)" 2>/dev/null || echo "0")
    echo "      ✅ API responds - Count: $REGULAR_COUNT"
else
    echo "      ❌ API not responding"
fi

# Test special/liturgy schedules
echo "   ⭐ Special Schedules (Liturgy):"
SPECIAL_RESULT=$(curl -s http://localhost:3001/api/liturgy-schedules)
if [ -n "$SPECIAL_RESULT" ]; then
    SPECIAL_COUNT=$(echo "$SPECIAL_RESULT" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data.get('schedules', [])) if isinstance(data, dict) else 0)" 2>/dev/null || echo "0")
    echo "      ✅ API responds - Count: $SPECIAL_COUNT"
else
    echo "      ❌ API not responding"
fi

# Test devotions
echo "   📿 Devotions:"
DEVOTION_RESULT=$(curl -s http://localhost:3001/api/devotions)
if [ -n "$DEVOTION_RESULT" ]; then
    DEVOTION_COUNT=$(echo "$DEVOTION_RESULT" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data.get('data', [])) if isinstance(data, dict) else 0)" 2>/dev/null || echo "0")
    echo "      ✅ API responds - Count: $DEVOTION_COUNT"
    
    if [ "$DEVOTION_COUNT" -gt 0 ]; then
        echo ""
        echo "   📊 Devotion Details:"
        echo "$DEVOTION_RESULT" | python3 -m json.tool | grep -E '"title"|"day_of_week"|"time"|"is_active"' | head -20
    fi
else
    echo "      ❌ API not responding"
fi

echo ""
echo "3️⃣ Checking Database..."
DB_PASSWORD=$(grep DB_PASSWORD .env | cut -d '=' -f2)
if [ -n "$DB_PASSWORD" ]; then
    echo "   📊 Active devotions in database:"
    mysql -u root -p"$DB_PASSWORD" stpaulus_cms_db -e "SELECT id, title, day_of_week, time, is_active FROM devotions WHERE is_active = 1;" 2>/dev/null
    
    echo ""
    echo "   📊 Active liturgy schedules in database:"
    mysql -u root -p"$DB_PASSWORD" stpaulus_cms_db -e "SELECT id, title, date, time, status FROM liturgy_schedules WHERE status = 'active' LIMIT 5;" 2>/dev/null
else
    echo "   ⚠️  Cannot read DB_PASSWORD from .env"
fi

echo ""
echo "4️⃣ Recommendations:"
echo "   💡 Open browser console (F12) and check for logs:"
echo "      - '=== WIDGET DEBUG ==='"
echo "      - 'Total devotions: X'"
echo "      - 'Widget - Devotions today: X'"
echo ""
echo "   💡 If all APIs return 0 or empty:"
echo "      - Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)"
echo "      - Clear browser cache"
echo "      - Restart dev server: npm run dev"
echo ""
echo "   💡 If devotions count is 0 in API but >0 in database:"
echo "      - Check server terminal for SQL errors"
echo "      - Verify devotion_types table exists"
echo ""
echo "=== DEBUG COMPLETE ==="
