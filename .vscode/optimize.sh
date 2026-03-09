#!/bin/bash

# VS Code Performance Optimization Helper
# Run this script if VS Code is still slow

echo "🚀 VS Code Performance Helper"
echo "=============================="
echo ""

# Check if VS Code is running
if pgrep -x "Code" > /dev/null; then
    echo "✅ VS Code is running"
    echo ""
    
    # Show memory usage
    echo "📊 Current Memory Usage:"
    ps aux | grep "Code Helper" | grep -v grep | awk '{printf "   Process: %s - Memory: %.1f MB\n", $11, $6/1024}'
    echo ""
    
    # Ask to restart
    read -p "Do you want to restart VS Code Extension Host? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 Restarting Extension Host..."
        osascript -e 'tell application "Visual Studio Code" to activate'
        osascript -e 'tell application "System Events" to keystroke "p" using {command down, shift down}'
        sleep 1
        osascript -e 'tell application "System Events" to keystroke "Developer: Restart Extension Host"'
        osascript -e 'tell application "System Events" to key code 36' # Enter
        echo "✅ Extension Host restarted!"
    fi
else
    echo "❌ VS Code is not running"
fi

echo ""
echo "💡 Additional Tips:"
echo "   1. Reload Window: Cmd+Shift+P → 'Developer: Reload Window'"
echo "   2. Clear Cache: rm -rf ~/Library/Application\\ Support/Code/Cache"
echo "   3. Check Extensions: Cmd+Shift+P → 'Show Running Extensions'"
echo ""
