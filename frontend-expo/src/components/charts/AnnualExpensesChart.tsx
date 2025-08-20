import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useAppTheme } from '../../theme/useAppTheme';

interface AnnualExpensesChartProps {
  year: number;
  data: number[];
  loading?: boolean;
}

const screenWidth = Dimensions.get('window').width;
const chartWidth = Math.min(screenWidth - (Platform.OS === 'ios' ? 80 : 100), 320); // Platform-specific padding

export default function AnnualExpensesChart({ year, data, loading = false }: AnnualExpensesChartProps) {
  const { colors } = useAppTheme();

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
          Gastos Anuales
        </Text>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Cargando...</Text>
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
          Gastos Anuales
        </Text>
        <View style={styles.noDataContainer}>
          <Text style={[styles.noDataText, { color: colors.textSecondary }]}>No hay datos disponibles para {year}</Text>
        </View>
      </View>
    );
  }

  const chartMonthLabels = [
    'E', 'F', 'M', 'A', 'M', 'J',
    'J', 'A', 'S', 'O', 'N', 'D'
  ];

  const monthLabels = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const chartData = {
    labels: chartMonthLabels,
    datasets: [
      {
        data: data,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Blue color
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Blue color
    labelColor: (opacity = 1) => `rgba(${colors.textSecondary === '#475569' ? '71, 85, 105' : '203, 213, 225'}, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#3b82f6',
    },
    strokeWidth: 3,
  };

  const totalAnnual = data.reduce((sum, value) => sum + value, 0);
  const averageMonthly = totalAnnual / 12;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
        Gastos Anuales {year}
      </Text>
      
      {/* Summary cards in a more compact layout */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: colors.surfaceSecondary }]}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]} numberOfLines={1}>
            Total Anual
          </Text>
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]} numberOfLines={1}>
            €{totalAnnual.toFixed(2)}
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.surfaceSecondary }]}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]} numberOfLines={1}>
            Promedio Mensual
          </Text>
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]} numberOfLines={1}>
            €{averageMonthly.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Compact line chart */}
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={Platform.OS === 'ios' ? 160 : 180}
          yAxisLabel="€"
          yAxisSuffix=""
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withDots={true}
          withShadow={false}
          withInnerLines={false}
          withVerticalLabels={true}
          withHorizontalLabels={true}
        />
      </View>

      {/* Commented bar chart for comparison */}
      {/*
      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={chartWidth}
          height={Platform.OS === 'ios' ? 160 : 180}
          yAxisLabel="€"
          yAxisSuffix=""
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          horizontalLabelRotation={0}
          showBarTops
          showValuesOnTopOfBars={false}
          fromZero
          style={styles.chart}
          withInnerLines={false}
          withVerticalLabels={true}
          withHorizontalLabels={true}
        />
      </View>
      */}

      {/* Monthly breakdown below chart */}
      <View style={styles.monthlyBreakdown}>
        <Text style={[styles.breakdownTitle, { color: colors.textPrimary }]}>
          Desglose Mensual
        </Text>
        <View style={styles.breakdownGrid}>
          {monthLabels.map((month, index) => (
            <View key={index} style={[styles.monthItem, { 
              backgroundColor: colors.surface,
              borderColor: colors.borderSecondary 
            }]}>
              <Text style={[styles.monthLabel, { color: colors.textSecondary }]}>
                {month}
              </Text>
              <Text style={[styles.monthAmount, { color: colors.textPrimary }]}>
                €{data[index]?.toFixed(2) || '0.00'}
              </Text>
            </View>
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  chartContainer: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  monthlyBreakdown: {
    marginTop: 20,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Platform.OS === 'ios' ? 8 : 10,
  },
  monthItem: {
    width: Platform.OS === 'ios' ? '48%' : '47%', // Slightly different for Android
    paddingVertical: Platform.OS === 'ios' ? 12 : 14,
    paddingHorizontal: Platform.OS === 'ios' ? 12 : 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent', // Will be overridden by borderSecondary
    alignItems: 'center',
  },
  monthLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 5,
  },
  monthAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
});
