import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useAppTheme } from '../../theme/useAppTheme';

interface SubcategoryExpense {
  subcategory?: {
    name?: string;
  };
  amount: number;
}

interface StatisticsChartProps {
  year: number;
  month: number;
  data: SubcategoryExpense[];
  loading?: boolean;
  onSubcategoryPress?: (subcategoryName: string) => void;
}

const screenWidth = Dimensions.get('window').width;
const chartWidth = Math.min(screenWidth - (Platform.OS === 'ios' ? 80 : 100), 300); // Platform-specific padding

export default function StatisticsChart({ year, month, data, loading = false, onSubcategoryPress }: StatisticsChartProps) {
  const { colors: themeColors } = useAppTheme();
  
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handleSubcategoryPress = (subcategoryName: string) => {
    if (onSubcategoryPress) {
      onSubcategoryPress(subcategoryName);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.card }]}>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>Estadísticas por Subcategoría</Text>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>Cargando estadísticas...</Text>
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.card }]}>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>Estadísticas por Subcategoría</Text>
        <View style={styles.noDataContainer}>
          <Text style={[styles.noDataText, { color: themeColors.textSecondary }]}>
            No hay datos disponibles para {monthNames[month - 1]} {year}
          </Text>
        </View>
      </View>
    );
  }

  // Generate colors for categories
  const colors = [
    themeColors.chartPrimary, themeColors.chartError, themeColors.chartSuccess, 
    themeColors.chartWarning, themeColors.chartSecondary, themeColors.info,
    '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  const chartData = data.map((item, index) => ({
    name: item.subcategory?.name || 'Sin subcategoría',
    amount: item.amount,
    color: colors[index % colors.length],
    legendFontColor: themeColors.textPrimary,
    legendFontSize: 12,
    legendFontFamily: 'System',
  }));

  const totalExpenses = data.reduce((sum, item) => sum + item.amount, 0);

  const chartConfig = {
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${themeColors.textSecondary === '#475569' ? '71, 85, 105' : '203, 213, 225'}, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.card }]}>
      <Text style={[styles.title, { color: themeColors.textPrimary }]} numberOfLines={2}>
        Estadísticas por Subcategoría - {monthNames[month - 1]} {year}
      </Text>
      
      {/* Chart centered */}
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={chartWidth}
          height={Platform.OS === 'ios' ? 220 : 240}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="80"
          absolute
          hasLegend={false}
          style={styles.chart}
        />
      </View>

      {/* Total expenses below chart */}
      <View style={[styles.totalContainer, { backgroundColor: themeColors.surfaceSecondary }]}>
        <Text style={[styles.totalLabel, { color: themeColors.textSecondary }]}>Total de Gastos</Text>
        <Text style={[styles.totalValue, { color: themeColors.textPrimary }]}>{formatCurrency(totalExpenses)}</Text>
      </View>

      {/* Subcategory breakdown below total */}
      <View style={styles.breakdownContainer}>
        <Text style={[styles.breakdownTitle, { color: themeColors.textPrimary }]}>
          Desglose por Subcategoría
        </Text>
        <View style={styles.breakdownList}>
          {chartData.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleSubcategoryPress(item.name)}>
              <View style={[styles.breakdownItem, { 
                borderBottomColor: themeColors.borderSecondary 
              }]}>
                <View style={styles.breakdownItemHeader}>
                  <View style={[styles.breakdownColor, { backgroundColor: item.color }]} />
                  <Text style={[styles.breakdownName, { color: themeColors.textPrimary }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[styles.breakdownAmount, { color: themeColors.textSecondary }]}>
                    {formatCurrency(item.amount)}
                  </Text>
                </View>
                <Text style={[styles.breakdownPercentage, { color: themeColors.textMuted }]}>
                  {((item.amount / totalExpenses) * 100).toFixed(1)}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
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
    minWidth: 300,
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
  totalContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  chart: {
    alignSelf: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    overflow: 'hidden',
    minWidth: 300,
    alignSelf: 'center',
    width: '100%',
  },
  breakdownContainer: {
    marginTop: 20,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  breakdownList: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 8 : 10,
    paddingHorizontal: Platform.OS === 'ios' ? 12 : 16,
    borderRadius: 8,
    marginBottom: Platform.OS === 'ios' ? 8 : 10,
    backgroundColor: 'transparent',
    // Interactive styles
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    // Make it look clickable
    minHeight: 50,
  },
  breakdownItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  breakdownColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  breakdownName: {
    flex: 1,
    fontSize: 14,
    marginRight: 10,
  },
  breakdownAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
  },
  breakdownPercentage: {
    fontSize: 12,
    fontWeight: '500',
  },
});
