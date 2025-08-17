import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

interface AnnualExpensesChartProps {
  year: number;
  data: number[];
  loading?: boolean;
}

const screenWidth = Dimensions.get('window').width;

export default function AnnualExpensesChart({ year, data, loading = false }: AnnualExpensesChartProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Gastos Anuales</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Gastos Anuales</Text>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No hay datos disponibles para {year}</Text>
        </View>
      </View>
    );
  }

  const monthLabels = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        data: data,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Blue color
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#1e293b',
    backgroundGradientFrom: '#1e293b',
    backgroundGradientTo: '#1e293b',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(203, 213, 225, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#3b82f6',
    },
  };

  const totalAnnual = data.reduce((sum, value) => sum + value, 0);
  const averageMonthly = totalAnnual / 12;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gastos Anuales {year}</Text>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Anual</Text>
          <Text style={styles.summaryValue}>€{totalAnnual.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Promedio Mensual</Text>
          <Text style={styles.summaryValue}>€{averageMonthly.toFixed(2)}</Text>
        </View>
      </View>

      <BarChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        yAxisLabel="€"
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        showBarTops
        showValuesOnTopOfBars
        fromZero
        style={styles.chart}
      />
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
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  noDataContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
