import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/useAppTheme';
import AccumulatedParamModal from '../ui/modal/AccumulatedParamModal';
import { useState } from 'react';
import { updateAccumulatedParam } from '../../api';

interface MonthlyTargetProps {
  year: number;
  month: number;
  data: {
    targetExpense?: number;
    currentExpensePercentage?: number;
    surplus?: number;
    accumulated?: number;
  } | null;
  loading?: boolean;
  currentExpense?: number;
  onUpdate?: () => void;
}

export default function MonthlyTarget({ year, month, data, currentExpense = 0, loading = false, onUpdate }: MonthlyTargetProps) {
  const { colors } = useAppTheme();
  const [isAccumulatedModalOpen, setIsAccumulatedModalOpen] = useState(false);
  
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

  const handleAccumulatedUpdate = async (newValue: number) => {
    try {
      await updateAccumulatedParam(newValue);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating accumulated param:', error);
      throw error;
    }
  };

  const handleAccumulatedRenew = async () => {
    try {
      const currentAccumulated = data?.accumulated ?? 0;
      const monthTarget = data?.targetExpense ?? 0;
      const newValue = currentAccumulated + monthTarget;
      await updateAccumulatedParam(newValue);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error renewing accumulated param:', error);
      throw error;
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage <= 80) return colors.success; // Green - Good
    if (percentage <= 100) return colors.warning; // Yellow - Warning
    return colors.error; // Red - Over budget
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

  // Debug logging
  console.log('MonthlyTarget - Received data:', { data, currentExpense, year, month });

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Objetivo Mensual</Text>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Cargando objetivo...</Text>
        </View>
      </View>
    );
  }

  if (!data || data.targetExpense === undefined || data.targetExpense === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Objetivo Mensual</Text>
        <View style={styles.noDataContainer}>
          <Text style={[styles.noDataText, { color: colors.textSecondary }]}>No hay objetivo configurado para {monthNames[month - 1]} {year}</Text>
        </View>
      </View>
    );
  }

  // Also check if we have current expense data
  if (currentExpense === undefined || currentExpense === null) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Objetivo Mensual</Text>
        <View style={styles.noDataContainer}>
          <Text style={[styles.noDataText, { color: colors.textSecondary }]}>Cargando datos de gastos para {monthNames[month - 1]} {year}</Text>
        </View>
      </View>
    );
  }

  // Calculate percentage if not provided or recalculate for accuracy
  const percentage = data.currentExpensePercentage || (currentExpense > 0 && data.targetExpense > 0 ? (currentExpense / data.targetExpense) * 100 : 0);
  const surplus = data.surplus || 0;

  console.log('MonthlyTarget - Calculated values:', { 
    targetExpense: data.targetExpense, 
    currentExpense, 
    percentage, 
    surplus 
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
        Objetivo Mensual - {monthNames[month - 1]} {year}
      </Text>
      
      {/* Target Overview */}
      <View style={styles.targetOverview}>
        <View style={[styles.targetItem, { 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }]}>
          <View style={[styles.targetBackgroundPattern, { backgroundColor: colors.infoLight }]} />
          <View style={[styles.targetIconContainer, { backgroundColor: colors.infoLight }]}>
            <Ionicons name="flag" size={20} color={colors.info} />
            <View style={[styles.targetIndicator, { backgroundColor: colors.info }]} />
          </View>
          <View style={styles.targetContent}>
            <Text style={[styles.targetLabel, { color: colors.textSecondary }]}>Meta de Gastos</Text>
            <Text style={[styles.targetValue, { color: colors.textPrimary }]}>{formatCurrency(data.targetExpense)}</Text>
          </View>
          <View style={[styles.targetDecoration, { backgroundColor: colors.infoLight }]} />
        </View>

        <View style={[styles.targetItem, { 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        }]}>
          <View style={[styles.targetBackgroundPattern, { backgroundColor: colors.errorLight }]} />
          <View style={[styles.targetIconContainer, { backgroundColor: colors.errorLight }]}>
            <Ionicons name="trending-down" size={20} color={colors.error} />
            <View style={[styles.targetIndicator, { backgroundColor: colors.error }]} />
          </View>
          <View style={styles.targetContent}>
            <Text style={[styles.targetLabel, { color: colors.textSecondary }]}>Gastos Actuales</Text>
            <Text style={[
              styles.targetValue,
              { color: currentExpense > data.targetExpense ? colors.error : colors.textPrimary }
            ]}>
              {formatCurrency(currentExpense)}
            </Text>
          </View>
          <View style={[styles.targetDecoration, { backgroundColor: colors.errorLight }]} />
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Progreso</Text>
          <Text style={[styles.progressPercentage, { color: colors.textPrimary }]}>{percentage.toFixed(1)}%</Text>
        </View>
        
        <View style={[styles.progressBar, { backgroundColor: colors.surfaceTertiary }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: getProgressColor(percentage),
                width: `${Math.min(percentage, 100)}%`
              }
            ]} 
          />
        </View>
        
        <View style={styles.progressFooter}>
          <Ionicons 
            name={getProgressIcon(percentage)} 
            size={20} 
            color={getProgressColor(percentage)} 
          />
          <Text style={[styles.progressMessage, { color: colors.textSecondary }]}>
            {getProgressMessage(percentage)}
          </Text>
        </View>
      </View>

      {/* Surplus/Deficit and Accumulated - Side by Side */}
      <View style={styles.bottomRow}>
        {/* Surplus/Deficit */}
        <View style={[styles.surplusContainer, { 
          backgroundColor: surplus >= 0 ? colors.successLight : colors.errorLight,
          borderColor: surplus >= 0 ? colors.successBorder : colors.errorBorder
        }]}>
          <Ionicons 
            name={surplus >= 0 ? 'trending-up' : 'trending-down'} 
            size={24} 
            color={surplus >= 0 ? colors.success : colors.error} 
          />
          <View style={styles.surplusContent}>
            <Text style={[styles.surplusLabel, { color: colors.textPrimary }]}>
              {surplus >= 0 ? 'Superávit' : 'Déficit'}
            </Text>
            <Text style={[styles.surplusValue, { 
              color: surplus >= 0 ? colors.success : colors.error 
            }]}>
              {formatCurrency(Math.abs(surplus))}
            </Text>
          </View>
        </View>

        {/* Accumulated */}
        <TouchableOpacity 
          style={[styles.accumulatedContainer, { 
            backgroundColor: ((data.accumulated ?? 0) + surplus) >= 0 ? colors.infoLight : colors.warningLight,
            borderColor: ((data.accumulated ?? 0) + surplus) >= 0 ? colors.infoBorder : colors.warningBorder
          }]}
          onPress={() => setIsAccumulatedModalOpen(true)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={((data.accumulated ?? 0) + surplus) >= 0 ? 'wallet' : 'alert-circle'} 
            size={24} 
            color={((data.accumulated ?? 0) + surplus) >= 0 ? colors.info : colors.warning} 
          />
          <View style={styles.accumulatedContent}>
            <Text style={[styles.accumulatedLabel, { color: colors.textPrimary }]}>
              Real
            </Text>
            <Text style={[styles.accumulatedValue, { 
              color: ((data.accumulated ?? 0) + surplus) >= 0 ? colors.info : colors.warning 
            }]}>
              {formatCurrency(Math.abs((data.accumulated ?? 0) + surplus))}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <AccumulatedParamModal
        isOpen={isAccumulatedModalOpen}
        onClose={() => setIsAccumulatedModalOpen(false)}
        currentValue={data?.accumulated ?? 0}
        monthExpenseTarget={data?.targetExpense ?? 0}
        onUpdate={handleAccumulatedUpdate}
        onRenew={handleAccumulatedRenew}
      />
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
  title: {
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
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
  },
  targetOverview: {
    flexDirection: 'row',
    gap: Platform.OS === 'ios' ? 16 : 20,
    marginTop: Platform.OS === 'ios' ? 16 : 20,
    marginBottom: Platform.OS === 'ios' ? 20 : 24,
  },
  targetItem: {
    flex: 1,
    padding: Platform.OS === 'ios' ? 20 : 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  targetBackgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05, // Adjust as needed for subtle pattern
    borderRadius: 20,
  },
  targetIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  targetIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  targetContent: {
    alignItems: 'center',
  },
  targetLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    opacity: 0.8,
  },
  targetValue: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  targetDecoration: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 12,
    opacity: 0.5,
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
    fontSize: 16,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressBar: {
    height: Platform.OS === 'ios' ? 8 : 10,
    borderRadius: Platform.OS === 'ios' ? 4 : 5,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Platform.OS === 'ios' ? 4 : 5,
  },
  progressFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressMessage: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 24,
  },
  surplusContainer: {
    width: '48%',
    alignItems: 'center',
    padding: Platform.OS === 'ios' ? 16 : 20,
    borderRadius: 12,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    minHeight: 80,
    justifyContent: 'center',
  },
  surplusContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  surplusLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  surplusValue: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  accumulatedContainer: {
    width: '48%',
    alignItems: 'center',
    padding: Platform.OS === 'ios' ? 16 : 20,
    borderRadius: 12,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    minHeight: 80,
    justifyContent: 'center',
  },
  accumulatedContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  accumulatedLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  accumulatedValue: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
