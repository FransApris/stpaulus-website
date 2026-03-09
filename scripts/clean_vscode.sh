#!/bin/bash

# Script to clean VS Code workspace and prevent crashes
# Usage: bash scripts/clean_vscode.sh

echo "🧹 Cleaning VS Code workspace..."

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo ""
echo "📂 Project: $PROJECT_DIR"
echo ""

# 1. Clean TypeScript cache
echo "🔧 Cleaning TypeScript cache..."
rm -rf .nuxt/tsconfig.*
rm -rf node_modules/.cache
rm -rf node_modules/.vite

# 2. Clean VS Code cache
echo "🔧 Cleaning VS Code cache..."
rm -rf .vscode/.cache
rm -rf .vscode-server/data/logs/*
rm -rf ~/Library/Application\ Support/Code/logs/*

# 3. Clean build artifacts
echo "🔧 Cleaning build artifacts..."
rm -rf .output
rm -rf dist
rm -rf build

# 4. Clean log files
echo "🔧 Cleaning log files..."
find . -name "*.log" -type f -not -path "./node_modules/*" -delete

# 5. Kill hanging processes
echo "🔧 Killing hanging processes..."
pkill -f "tsserver" 2>/dev/null
pkill -f "eslint" 2>/dev/null
pkill -f "vite" 2>/dev/null

# 6. Check VS Code running
if pgrep -x "Code" > /dev/null; then
    echo ""
    echo "⚠️  VS Code is currently running"
    echo "   Please close VS Code and run this script again"
    echo ""
    exit 1
fi

echo ""
echo "✅ Cleanup completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Open VS Code"
echo "   2. Run: npm run dev"
echo ""
