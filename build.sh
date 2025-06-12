#!/bin/bash

# NetworkReview Plugin Build Script
echo "Building NetworkReview Plugin..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the plugin
echo "Building plugin..."
npm run build

# Check if build was successful
if [ -f "dist/remoteEntry.js" ]; then
    echo "✅ NetworkReview plugin built successfully!"
    echo "📁 Output: dist/remoteEntry.js"
else
    echo "❌ Build failed - remoteEntry.js not found"
    exit 1
fi

echo "🎉 NetworkReview plugin is ready for deployment!"