import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      return percentage >= 0 ? '#22c55e' : '#ef4444';
    } else {
      return percentage <= 0 ? '#22c55e' : '#ef4444';
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
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Métricas Financieras</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando métricas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Métricas Financieras - {monthNames[month - 1]} {year}</Text>
      
      <View style={styles.metricsGrid}>
        {/* Income Metric */}
        <TouchableOpacity 
          style={[styles.metricCard, styles.incomeCard]} 
          onPress={onIncomePress}
          disabled={!onIncomePress}
        >
          <View style={styles.metricIconContainer}>
            <Ionicons name="people" size={24} color="#059669" />
          </View>
          
          <View style={styles.metricContent}>
            <Text style={styles.metricLabel}>Ingresos</Text>
            <Text style={styles.metricValue}>
              {data?.totalIncome ? formatCurrency(data.totalIncome) : '€0.00'}
            </Text>
          </View>

          {data?.prevMonthIncomeDiff !== undefined && (
            <View style={styles.percentageContainer}>
              <Ionicons 
                name={getPercentageIcon(data.prevMonthIncomeDiff)} 
                size={16} 
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
        </TouchableOpacity>

        {/* Expenses Metric */}
        <View style={[styles.metricCard, styles.expenseCard]}>
          <View style={styles.metricIconContainer}>
            <Ionicons name="card" size={24} color="#dc2626" />
          </View>
          
          <View style={styles.metricContent}>
            <Text style={styles.metricLabel}>Gastos</Text>
            <Text style={styles.metricValue}>
              {data?.totalExpenses ? formatCurrency(data.totalExpenses) : '€0.00'}
            </Text>
          </View>

          {data?.prevMonthExpensesDiff !== undefined && (
            <View style={styles.percentageContainer}>
              <Ionicons 
                name={getPercentageIcon(data.prevMonthExpensesDiff)} 
                size={16} 
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

      {/* Net Income/Expense */}
      {data?.totalIncome !== undefined && data?.totalExpenses !== undefined && (
        <View style={styles.netContainer}>
          <Text style={styles.netLabel}>Balance Neto</Text>
          <Text style={[
            styles.netValue,
            { color: data.totalIncome - data.totalExpenses >= 0 ? '#059669' : '#dc2626' }
          ]}>
            {formatCurrency(data.totalIncome - data.totalExpenses)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b', // Dark slate background
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  incomeCard: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  expenseCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  metricIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 4,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  netContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  netLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  netValue: {
    fontSize: 18,
    fontWeight: '700',
  },
});
