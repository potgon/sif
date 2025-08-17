import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MonthlyTargetProps {
  year: number;
  month: number;
  data: {
    targetExpense?: number;
    currentExpense?: number;
    currentExpensePercentage?: number;
    surplus?: number;
  } | null;
  loading?: boolean;
}

export default function MonthlyTarget({ year, month, data, loading = false }: MonthlyTargetProps) {
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

  const getProgressColor = (percentage: number) => {
    if (percentage <= 80) return '#22c55e'; // Green - Good
    if (percentage <= 100) return '#f59e0b'; // Yellow - Warning
    return '#ef4444'; // Red - Over budget
  };

  const getProgressIcon = (percentage: number) => {
    if (percentage <= 80) return 'checkmark-circle' as const;
    if (percentage <= 100) return 'warning' as const;
    return 'close-circle' as const;
  };

  const getProgressMessage = (percentage: number) => {
    if (percentage <= 80) return '¡Excelente! Estás por debajo del objetivo';
    if (percentage <= 100) return 'Cuidado, estás cerca del límite';
    return 'Has superado el objetivo mensual';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Objetivo Mensual</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando objetivo...</Text>
        </View>
      </View>
    );
  }

  if (!data || data.targetExpense === undefined) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Objetivo Mensual</Text>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No hay objetivo configurado para {monthNames[month - 1]} {year}</Text>
        </View>
      </View>
    );
  }

  const currentExpense = data.currentExpense || 0;
  const percentage = data.currentExpensePercentage || 0;
  const surplus = data.surplus || 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Objetivo Mensual - {monthNames[month - 1]} {year}</Text>
      
      {/* Target Overview */}
      <View style={styles.targetOverview}>
        <View style={styles.targetItem}>
          <Text style={styles.targetLabel}>Meta de Gastos</Text>
          <Text style={styles.targetValue}>{formatCurrency(data.targetExpense)}</Text>
        </View>
        
        <View style={styles.targetItem}>
          <Text style={styles.targetLabel}>Gastos Actuales</Text>
          <Text style={[
            styles.targetValue,
            { color: currentExpense > data.targetExpense ? '#ef4444' : '#1f2937' }
          ]}>
            {formatCurrency(currentExpense)}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progreso</Text>
          <Text style={styles.progressPercentage}>{percentage.toFixed(1)}%</Text>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: getProgressColor(percentage)
                }
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.progressIconContainer}>
          <Ionicons 
            name={getProgressIcon(percentage)} 
            size={20} 
            color={getProgressColor(percentage)} 
          />
          <Text style={[styles.progressMessage, { color: getProgressColor(percentage) }]}>
            {getProgressMessage(percentage)}
          </Text>
        </View>
      </View>

      {/* Surplus/Deficit */}
      <View style={styles.surplusContainer}>
        <Text style={styles.surplusLabel}>Balance</Text>
        <Text style={[
          styles.surplusValue,
          { color: surplus >= 0 ? '#22c55e' : '#ef4444' }
        ]}>
          {surplus >= 0 ? '+' : ''}{formatCurrency(surplus)}
        </Text>
        <Text style={styles.surplusDescription}>
          {surplus >= 0 ? 'Superávit disponible' : 'Déficit acumulado'}
        </Text>
      </View>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  noDataContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  targetOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  targetItem: {
    alignItems: 'center',
    flex: 1,
  },
  targetLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
    textAlign: 'center',
  },
  targetValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f8fafc',
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressMessage: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  surplusContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  surplusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 4,
  },
  surplusValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  surplusDescription: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
