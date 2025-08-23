# 🎨 SIF Finances - App Customization Guide

This guide will help you customize your SIF Finances Expo app with your own branding, icons, and splash screens.

## 📱 What We've Customized

### ✅ App Configuration (`app.json`)
- **App Name**: "SIF - Sistema de Finanzas"
- **App Slug**: "sif-finances"
- **Primary Color**: Blue (#2563eb)
- **Bundle ID**: com.sif.finances
- **Package Name**: com.sif.finances

### 🖼️ Assets Configuration
- **App Icon**: Uses your `logo-v2.png`
- **Splash Screen**: Uses your `logo-v2.png` with blue background
- **Android Adaptive Icon**: Uses your `logo-v2.png` with blue background
- **Web Favicon**: Uses your `logo-v2.png`

## 🚀 Quick Start

### Option 1: Use the Asset Generation Script (Recommended)

1. **Install ImageMagick** (if not already installed):
   ```bash
   # Ubuntu/Debian
   sudo apt-get install imagemagick
   
   # macOS
   brew install imagemagick
   
   # Windows
   # Download from https://imagemagick.org/
   ```

2. **Run the asset generation script**:
   ```bash
   ./generate-assets.sh
   ```

3. **Start your app**:
   ```bash
   npx expo start
   ```

### Option 2: Manual Asset Creation

If you prefer to create assets manually, you'll need these sizes:

| Asset | Size | Filename | Purpose |
|-------|------|----------|---------|
| App Icon | 1024×1024 | `icon.png` | Main app icon |
| Android Adaptive Icon | 108×108 | `adaptive-icon.png` | Android home screen |
| Splash Screen | 200×200 | `splash-icon.png` | Loading screen |
| Favicon | 32×32 | `favicon.png` | Web browser tab |
| iOS Icon | 180×180 | `icon-ios.png` | iOS home screen |

## 🎯 Testing Your Customization

### 1. Start the Development Server
```bash
npx expo start
```

### 2. Use Expo Go on Your iPhone
- Download **Expo Go** from the App Store
- Scan the QR code displayed in your terminal
- Your custom branding should appear!

### 3. What You'll See
- **App Icon**: Your logo on the home screen
- **Splash Screen**: Your logo with blue background during loading
- **App Name**: "SIF - Sistema de Finanzas" in the app switcher

## 🔧 Customization Options

### Change the Primary Color
Edit `app.json` and modify the `primaryColor` value:
```json
{
  "expo": {
    "primaryColor": "#your-color-here"
  }
}
```

### Change the Background Color
Edit the splash screen configuration in `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#your-color-here"
        }
      ]
    ]
  }
}
```

### Update App Name
Edit the `name` field in `app.json`:
```json
{
  "expo": {
    "name": "Your Custom App Name"
  }
}
```

## 📱 Expo Go Limitations

Since you're using **Expo Go** (which is perfect for development and testing):

- ✅ **Custom Icons**: Will work
- ✅ **Custom Splash Screen**: Will work
- ✅ **Custom App Name**: Will work
- ✅ **Custom Colors**: Will work
- ❌ **Custom Bundle ID**: Won't affect Expo Go
- ❌ **Custom Package Name**: Won't affect Expo Go

## 🚨 Troubleshooting

### Icons Not Showing
1. Make sure your `logo-v2.png` is in `assets/images/`
2. Verify the filenames in `app.json` match your actual files
3. Restart the Expo development server

### Splash Screen Not Working
1. Check that `expo-splash-screen` plugin is properly configured
2. Ensure the splash image path is correct
3. Clear Expo Go cache and restart

### App Name Not Updating
1. Close Expo Go completely
2. Restart the development server
3. Scan the QR code again

## 🎨 Design Tips

### Icon Design
- Use a **square image** (your logo will be automatically centered)
- Ensure good contrast with the background
- Test how it looks at small sizes

### Color Scheme
- The current blue (#2563eb) complements most logos
- Consider using your brand colors for consistency
- Ensure good contrast for accessibility

## 📚 Additional Resources

- [Expo App Configuration](https://docs.expo.dev/versions/latest/config/app/)
- [Expo Splash Screen](https://docs.expo.dev/versions/latest/sdk/splash-screen/)
- [Expo Icons](https://docs.expo.dev/versions/latest/config/app/#icon)

## 🎉 You're All Set!

Your SIF Finances app now has:
- ✅ Custom branding and colors
- ✅ Your logo as the app icon
- ✅ Professional splash screen
- ✅ Optimized for Expo Go

Run `npx expo start` and enjoy your customized app! 🚀
