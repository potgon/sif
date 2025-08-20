# SIF Mobile App (React Native + Expo)

A comprehensive financial management mobile application built with React Native and Expo, featuring modern UI components, real-time data visualization, and a complete theme system.

## ✨ Features

### 🎨 **Comprehensive Theme System**
- **Light & Dark Mode**: Full theme switching with persistent preferences
- **Theme-Aware Components**: All UI components automatically adapt to current theme
- **Persistent Storage**: Theme preference saved using AsyncStorage
- **Dynamic Status Bar**: Automatically adjusts based on theme (light/dark)

### 📊 **Financial Dashboard**
- **Real-time Metrics**: Monthly income, expenses, and balance
- **Interactive Charts**: Annual expenses visualization with react-native-chart-kit
- **Progress Tracking**: Monthly expense targets with visual progress bars
- **Category Analytics**: Subcategory expense breakdown with pie charts

### 🔄 **Transaction Management**
- **Full CRUD Operations**: Create, read, update, and delete transactions
- **Smart Modals**: Income updates, transaction editing, and new transaction creation
- **Category System**: Organized subcategory management
- **Recurring Transactions**: Support for recurring financial activities

### 🔐 **Authentication & Security**
- **JWT Integration**: Secure token-based authentication
- **Persistent Sessions**: Automatic login state management
- **Protected Routes**: Secure access to financial data
- **Auto-logout**: Session expiration handling

### 📱 **Modern Mobile UI**
- **Responsive Design**: Optimized for all mobile screen sizes
- **Smooth Animations**: Native performance with React Native
- **Intuitive Navigation**: Sidebar-based navigation system
- **Touch-Optimized**: Mobile-first interaction design

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ 
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation
   ```bash
# Install dependencies
   npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 🎯 **Theme System Usage**

### Basic Theme Hook
```typescript
import { useAppTheme } from '@/src/theme/useAppTheme';

function MyComponent() {
  const { colors, isDark, toggleTheme } = useAppTheme();
  
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.textPrimary }}>
        Current theme: {isDark ? 'Dark' : 'Light'}
      </Text>
      <Button onPress={toggleTheme} title="Toggle Theme" />
    </View>
  );
}
```

### Theme-Aware Styling
```typescript
const styles = StyleSheet.create({
  container: {
    // Remove hardcoded colors - they're applied dynamically
    borderRadius: 12,
    padding: 16,
  },
});

// Apply theme colors dynamically
<View style={[styles.container, { 
  backgroundColor: colors.card,
  borderColor: colors.border 
}]}>
```

### Available Theme Colors
- **Background**: `colors.background`, `colors.surface`, `colors.surfaceSecondary`
- **Text**: `colors.textPrimary`, `colors.textSecondary`, `colors.textMuted`
- **Status**: `colors.success`, `colors.error`, `colors.warning`, `colors.info`
- **Components**: `colors.card`, `colors.border`, `colors.inputBackground`

## 🏗️ **Architecture**

### Core Structure
```
src/
├── components/          # Reusable UI components
│   ├── charts/         # Chart components (react-native-chart-kit)
│   ├── expenses/       # Financial dashboard components
│   └── ui/             # Base UI components (buttons, inputs, modals)
├── context/            # React Context providers
│   ├── SidebarContext  # Navigation state management
│   └── ThemeContext    # Theme state management
├── theme/              # Theme system
│   ├── colors.ts       # Color definitions for light/dark modes
│   └── useAppTheme.ts  # Theme hook for components
├── api/                # API integration layer
│   ├── client.ts       # Axios client with interceptors
│   └── expenses/       # Financial data endpoints
└── layout/             # App layout components
    ├── AppLayout.tsx   # Main app layout wrapper
    ├── AppHeader.tsx   # Header with theme toggle
    └── AppSidebar.tsx  # Navigation sidebar
```

### Theme Implementation
- **Context Provider**: `ThemeContext` manages global theme state
- **Color Schemes**: Separate color palettes for light and dark modes
- **Component Integration**: All components use `useAppTheme()` hook
- **Persistent Storage**: Theme preference saved in AsyncStorage

## 📱 **Component Library**

### Charts & Visualizations
- **AnnualExpensesChart**: Bar chart for yearly expense tracking
- **StatisticsChart**: Pie chart for subcategory breakdown
- **MonthlyTarget**: Progress bar for expense targets

### Financial Components
- **FinanceMetrics**: Key financial indicators display
- **RecentTransactions**: Transaction list with actions
- **MonthlyTarget**: Expense goal tracking

### UI Components
- **Button**: Theme-aware button with variants
- **Select**: Dropdown selector with theme support
- **Alert**: Status notifications with theme colors
- **Modal System**: Income, transaction, and editing modals

## 🔌 **API Integration**

### Authentication Flow
1. **Login/Register**: JWT token acquisition
2. **Token Storage**: Secure AsyncStorage implementation
3. **Request Interceptors**: Automatic token inclusion
4. **Response Handling**: 401 error handling with auto-logout

### Financial Endpoints
- **Metrics**: Monthly and annual financial data
- **Transactions**: CRUD operations for financial records
- **Categories**: Subcategory management
- **Parameters**: User preferences and settings

## 🎨 **Theme Customization**

### Adding New Colors
```typescript
// In src/theme/colors.ts
export const lightColors = {
  // ... existing colors
  customColor: '#your-color',
};

export const darkColors = {
  // ... existing colors
  customColor: '#your-dark-color',
};
```

### Component Theme Integration
```typescript
import { useAppTheme } from '@/src/theme/useAppTheme';

function CustomComponent() {
  const { colors } = useAppTheme();
  
  return (
    <View style={{ backgroundColor: colors.customColor }}>
      {/* Component content */}
    </View>
  );
}
```

## 🚀 **Performance Features**

- **Optimized Re-renders**: Theme changes only affect necessary components
- **Lazy Loading**: Components load only when needed
- **Memory Management**: Efficient state management with React Context
- **Native Performance**: React Native optimizations for smooth animations

## 🔧 **Development**

### Adding New Themes
1. Extend color definitions in `src/theme/colors.ts`
2. Update `ThemeContext` to support new theme modes
3. Ensure all components use theme-aware styling

### Component Guidelines
- **No Hardcoded Colors**: Always use theme colors
- **Responsive Design**: Support both light and dark modes
- **Accessibility**: Maintain proper contrast ratios
- **Performance**: Minimize re-renders during theme changes

## 📱 **Platform Support**

- **iOS**: Full support with native performance
- **Android**: Optimized for Material Design guidelines
- **Web**: Responsive design for web platforms
- **Cross-platform**: Consistent experience across devices

## 🎯 **Future Enhancements**

- **Custom Themes**: User-defined color schemes
- **System Theme**: Automatic theme detection
- **Animation Transitions**: Smooth theme switching animations
- **Accessibility**: Enhanced contrast and font size options

---

**Built with ❤️ using React Native, Expo, and modern mobile development practices.**
