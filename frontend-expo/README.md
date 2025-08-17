# SIF Frontend Expo

A React Native mobile application for personal finance management, built with Expo.

## Features

### Visual Components

The app now includes beautiful, interactive visual components for displaying financial data:

#### 📊 **AnnualExpensesChart**
- Bar chart showing monthly expenses throughout the year
- Interactive with month selection
- Displays total annual and average monthly expenses
- Responsive design with smooth animations

#### 💰 **FinanceMetrics**
- Card-based layout showing income and expenses
- Visual indicators with trend arrows
- Color-coded percentage changes
- Net balance calculation
- Interactive income card for future modal integration

#### 🎯 **MonthlyTarget**
- Progress bar visualization for expense targets
- Color-coded progress indicators (green/yellow/red)
- Surplus/deficit display
- Motivational messages based on progress

#### 📈 **StatisticsChart**
- Pie chart showing expenses by subcategory
- Custom color palette for each category
- Interactive legend with amounts and percentages
- Total expenses summary

#### 💳 **RecentTransactions**
- Modern transaction list with icons
- Color-coded income/expense indicators
- Category badges and date formatting
- Add transaction button
- Transaction interaction support

### Technical Features

- **React Native Charts**: Uses `react-native-chart-kit` for beautiful data visualization
- **Responsive Design**: Adapts to different screen sizes
- **Modern UI**: Clean, card-based design with shadows and rounded corners
- **Loading States**: Proper loading indicators for all components
- **Error Handling**: Graceful fallbacks for missing data
- **TypeScript**: Fully typed components and interfaces

## Installation

```bash
npm install
```

## Dependencies

- `react-native-chart-kit`: For charts and data visualization
- `react-native-svg`: Required for chart rendering
- `@expo/vector-icons`: For beautiful icons throughout the app

## Usage

The components are designed to work together on the home dashboard:

```tsx
import {
  AnnualExpensesChart,
  FinanceMetrics,
  MonthlyTarget,
  RecentTransactions,
  StatisticsChart
} from "@/src/components/expenses";

// Use in your component
<FinanceMetrics
  year={2024}
  month={12}
  data={monthlyMetrics}
  loading={isLoading}
  onIncomePress={handleIncomePress}
/>
```

## API Integration

All components are designed to work with the existing SIF backend API:

- `fetchMonthlyMetrics`: For financial metrics
- `fetchMonthlyExpenseTarget`: For monthly targets
- `fetchAnnualMetrics`: For annual expense data
- `fetchMonthlyCategoryExpenses`: For category statistics
- `fetchMonthlyTransactions`: For recent transactions

## Styling

Components use a consistent design system:
- **Colors**: Modern palette with semantic meaning (green for income, red for expenses)
- **Shadows**: Subtle elevation effects for depth
- **Typography**: Clear hierarchy with proper font weights
- **Spacing**: Consistent padding and margins throughout

## Future Enhancements

- Modal integration for income updates
- Transaction detail views
- Add/edit transaction functionality
- Dark mode support
- Customizable chart colors
- Export functionality for charts

## Contributing

When adding new components:
1. Follow the existing component structure
2. Include proper TypeScript interfaces
3. Add loading and error states
4. Use consistent styling patterns
5. Include proper documentation
