#!/bin/bash

# SIF Finances - Asset Generation Script
# This script helps you generate properly sized assets for your Expo app
# You'll need to run this on a system with ImageMagick or similar tools

echo "🎨 SIF Finances - Asset Generation Script"
echo "=========================================="
echo ""
echo "This script will help you generate the properly sized assets for your Expo app."
echo "Make sure you have ImageMagick installed: sudo apt-get install imagemagick"
echo ""

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    echo "✅ ImageMagick found! Generating assets..."
    echo ""
    
    # Create app icon (1024x1024)
    echo "📱 Generating app icon (1024x1024)..."
    convert assets/images/logo-v2.png -resize 1024x1024 -background transparent -gravity center -extent 1024x1024 assets/images/icon.png
    
    # Create adaptive icon for Android (108x108)
    echo "🤖 Generating Android adaptive icon (108x108)..."
    convert assets/images/logo-v2.png -resize 108x108 -background transparent -gravity center -extent 108x108 assets/images/adaptive-icon.png
    
    # Create splash screen icon (200x200)
    echo "🖼️  Generating splash screen icon (200x200)..."
    convert assets/images/logo-v2.png -resize 200x200 -background transparent -gravity center -extent 200x200 assets/images/splash-icon.png
    
    # Create favicon (32x32)
    echo "🌐 Generating favicon (32x32)..."
    convert assets/images/logo-v2.png -resize 32x32 -background transparent -gravity center -extent 32x32 assets/images/favicon.png
    
    # Create different density icons for iOS
    echo "📱 Generating iOS icons..."
    convert assets/images/logo-v2.png -resize 180x180 -background transparent -gravity center -extent 180x180 assets/images/icon-ios.png
    convert assets/images/logo-v2.png -resize 120x120 -background transparent -gravity center -extent 120x120 assets/images/icon-ios-120.png
    convert assets/images/logo-v2.png -resize 76x76 -background transparent -gravity center -extent 76x76 assets/images/icon-ios-76.png
    
    echo ""
    echo "✅ All assets generated successfully!"
    echo ""
    echo "📁 Generated files:"
    ls -la assets/images/
    
else
    echo "❌ ImageMagick not found!"
    echo ""
    echo "Please install ImageMagick first:"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  macOS: brew install imagemagick"
    echo "  Windows: Download from https://imagemagick.org/"
    echo ""
    echo "Alternatively, you can manually resize your logo-v2.png to these dimensions:"
    echo "  - App Icon: 1024x1024 pixels"
    echo "  - Android Adaptive Icon: 108x108 pixels"
    echo "  - Splash Screen: 200x200 pixels"
    echo "  - Favicon: 32x32 pixels"
    echo ""
    echo "Then rename them to match the filenames above."
fi

echo ""
echo "🎯 Next steps:"
echo "1. Run 'npx expo start' to test your app"
echo "2. Use Expo Go on your iPhone to scan the QR code"
echo "3. Your custom branding should now appear!"
echo ""
