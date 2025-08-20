import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/useAppTheme';

interface FinanceMetricsProps {
  year: number;
  month: number;
  data: {
    totalIncome?: number;
    totalExpenses?: number;
    prevMonthIncomeDiff?: number;
    prevMonthExpensesDiff?: number;
  } | null;
  loading?: boolean;
  onIncomePress?: () => void;
}

export default function FinanceMetrics({ 
  year, 
  month, 
  data, 
  loading = false, 
  onIncomePress 
}: FinanceMetricsProps) {
  const { colors } = useAppTheme();
  
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getPercentageColor = (percentage: number, isIncome: boolean) => {
    if (isIncome) {
      return percentage >= 0 ? colors.success : colors.error;
    } else {
      return percentage <= 0 ? colors.success : colors.error;
    }
  };

  const getPercentageIcon = (percentage: number) => {
    if (percentage >= 0) {
      return 'trending-up' as const;
    } else {
      return 'trending-down' as const;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Métricas Financieras</Text>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Cargando métricas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Métricas Financieras - {monthNames[month - 1]} {year}</Text>
      
      <View style={styles.metricsGrid}>
        {/* Income Metric */}
        <TouchableOpacity 
          style={[styles.metricCard, { 
            backgroundColor: colors.surface,
            borderColor: colors.border 
          }]} 
          onPress={onIncomePress}
          disabled={!onIncomePress}
        >
          <View style={[styles.metricIconContainer, { backgroundColor: colors.successLight }]}>
            <Ionicons name="people" size={20} color={colors.success} />
          </View>
          
          <View style={styles.metricContent}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Ingresos</Text>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
              {data?.totalIncome ? formatCurrency(data.totalIncome) : '€0.00'}
            </Text>
            
            {data?.prevMonthIncomeDiff !== undefined && (
              <View style={styles.percentageContainer}>
                <Ionicons 
                  name={getPercentageIcon(data.prevMonthIncomeDiff)} 
                  size={12} 
                  color={getPercentageColor(data.prevMonthIncomeDiff, true)} 
                />
                <Text style={[
                  styles.percentageText, 
                  { color: getPercentageColor(data.prevMonthIncomeDiff, true) }
                ]}>
                  {data.prevMonthIncomeDiff >= 0 ? '+' : ''}{data.prevMonthIncomeDiff.toFixed(1)}%
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Expenses Metric */}
        <View style={[styles.metricCard, { 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }]}>
          <View style={[styles.metricIconContainer, { backgroundColor: colors.errorLight }]}>
            <Ionicons name="trending-down" size={20} color={colors.error} />
          </View>
          
          <View style={styles.metricContent}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Gastos</Text>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
              {data?.totalExpenses ? formatCurrency(data.totalExpenses) : '€0.00'}
            </Text>
            
            {data?.prevMonthExpensesDiff !== undefined && (
              <View style={styles.percentageContainer}>
                <Ionicons 
                  name={getPercentageIcon(data.prevMonthExpensesDiff)} 
                  size={12} 
                  color={getPercentageColor(data.prevMonthExpensesDiff, false)} 
                />
                <Text style={[
                  styles.percentageText, 
                  { color: getPercentageColor(data.prevMonthExpensesDiff, false) }
                ]}>
                  {data.prevMonthExpensesDiff >= 0 ? '+' : ''}{data.prevMonthExpensesDiff.toFixed(1)}%
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Balance Metric */}
        <View style={[styles.metricCard, { 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }]}>
          <View style={[styles.metricIconContainer, { backgroundColor: colors.infoLight }]}>
            <Ionicons name="wallet" size={20} color={colors.info} />
          </View>
          
          <View style={styles.metricContent}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Balance</Text>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
              {data?.totalIncome && data?.totalExpenses 
                ? formatCurrency(data.totalIncome - data.totalExpenses) 
                : '€0.00'
              }
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: Platform.OS === 'ios' ? 8 : 12,
    marginTop: Platform.OS === 'ios' ? 16 : 20,
  },
  metricCard: {
    flex: 1,
    padding: Platform.OS === 'ios' ? 12 : 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: Platform.OS === 'ios' ? 8 : 12,
    overflow: 'hidden',
    minHeight: 100,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  percentageText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
