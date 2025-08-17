import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

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
}

const screenWidth = Dimensions.get('window').width;

export default function StatisticsChart({ year, month, data, loading = false }: StatisticsChartProps) {
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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Estadísticas por Subcategoría</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando estadísticas...</Text>
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Estadísticas por Subcategoría</Text>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            No hay datos disponibles para {monthNames[month - 1]} {year}
          </Text>
        </View>
      </View>
    );
  }

  // Generate colors for categories
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  const chartData = data.map((item, index) => ({
    name: item.subcategory?.name || 'Sin subcategoría',
    amount: item.amount,
    color: colors[index % colors.length],
    legendFontColor: '#1f2937',
    legendFontSize: 12,
  }));

  const totalExpenses = data.reduce((sum, item) => sum + item.amount, 0);

  const chartConfig = {
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(203, 213, 225, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Estadísticas por Subcategoría - {monthNames[month - 1]} {year}
      </Text>
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total de Gastos</Text>
        <Text style={styles.totalValue}>{formatCurrency(totalExpenses)}</Text>
      </View>

      <PieChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        hasLegend={false}
      />

      {/* Custom Legend */}
      <View style={styles.legendContainer}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <View style={styles.legendText}>
              <Text style={styles.legendName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.legendAmount}>
                {formatCurrency(item.amount)} ({((item.amount / totalExpenses) * 100).toFixed(1)}%)
              </Text>
            </View>
          </View>
        ))}
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
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  noDataContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  totalContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: '#334155',
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
  },
  legendContainer: {
    marginTop: 20,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
  },
  legendName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 2,
  },
  legendAmount: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
