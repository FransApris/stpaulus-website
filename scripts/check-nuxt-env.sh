#!/bin/bash

# Script: Check and prepare Nuxt environment
# Purpose: Prevent VSCode crash due to missing .nuxt directory
# Usage: Run automatically on VSCode open or manually

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
NUXT_DIR="$PROJECT_DIR/.nuxt"

echo "🔍 Checking Nuxt environment..."

# Check if .nuxt directory exists
if [ ! -d "$NUXT_DIR" ]; then
    echo "⚠️  .nuxt directory not found!"
    echo "🔧 Generating .nuxt directory..."
    cd "$PROJECT_DIR"
    npm run prepare:nuxt
    echo "✅ .nuxt directory generated successfully"
else
    echo "✅ .nuxt directory exists"
    
    # Check if tsconfig.json exists
    if [ ! -f "$NUXT_DIR/tsconfig.json" ]; then
        echo "⚠️  .nuxt/tsconfig.json missing!"
        echo "🔧 Regenerating .nuxt directory..."
        cd "$PROJECT_DIR"
        npm run prepare:nuxt
        echo "✅ .nuxt/tsconfig.json generated successfully"
    else
        echo "✅ .nuxt/tsconfig.json exists"
    fi
fi

echo ""
echo "🎉 Nuxt environment is ready!"
echo ""
