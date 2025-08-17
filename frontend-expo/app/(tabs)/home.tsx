import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import Select from "@/src/components/ui/form/Select";
import Alert from "@/src/components/ui/alert/Alert";
import { 
  fetchMonthlyMetrics, 
  fetchMonthlyTransactions, 
  fetchMonthlyExpenseTarget,
  fetchAnnualMetrics 
} from "@/src/api";

const months = [
  { label: "Enero", value: "1" },
  { label: "Febrero", value: "2" },
  { label: "Marzo", value: "3" },
  { label: "Abril", value: "4" },
  { label: "Mayo", value: "5" },
  { label: "Junio", value: "6" },
  { label: "Julio", value: "7" },
  { label: "Agosto", value: "8" },
  { label: "Septiembre", value: "9" },
  { label: "Octubre", value: "10" },
  { label: "Noviembre", value: "11" },
  { label: "Diciembre", value: "12" },
];

const years = Array.from({ length: 5 }, (_, i) => ({
  label: String(new Date().getFullYear() - i),
  value: String(new Date().getFullYear() - i),
}));

export default function Home() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    String(now.getMonth() + 1),
  );
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [monthlyMetrics, setMonthlyMetrics] = useState<any>(null);
  const [monthlyTransactions, setMonthlyTransactions] = useState<any>(null);
  const [expenseTarget, setExpenseTarget] = useState<any>(null);
  const [annualMetrics, setAnnualMetrics] = useState<any>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [metrics, transactions, target, annual] = await Promise.all([
        fetchMonthlyMetrics(parseInt(selectedYear), parseInt(selectedMonth)),
        fetchMonthlyTransactions(parseInt(selectedYear), parseInt(selectedMonth)),
        fetchMonthlyExpenseTarget(parseInt(selectedYear), parseInt(selectedMonth)),
        fetchAnnualMetrics(parseInt(selectedYear))
      ]);
      
      setMonthlyMetrics(metrics);
      setMonthlyTransactions(transactions);
      setExpenseTarget(target);
      setAnnualMetrics(annual);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al cargar los datos");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getMonthLabel = (monthValue: string) => {
    return months.find((m) => m.value === monthValue)?.label || monthValue;
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Control</Text>

        <View style={styles.selectors}>
          <View style={styles.selector}>
            <Select
              options={years}
              value={selectedYear}
              onChange={setSelectedYear}
              placeholder="Seleccionar año"
            />
          </View>

          <View style={styles.selector}>
            <Select
              options={months}
              value={selectedMonth}
              onChange={setSelectedMonth}
              placeholder="Seleccionar mes"
            />
          </View>
        </View>
      </View>

      {error && (
        <Alert
          variant="error"
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <View style={styles.content}>
        {/* Monthly Metrics Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Métricas Financieras</Text>
          {monthlyMetrics ? (
            <View style={styles.metricsContainer}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Ingresos Totales:</Text>
                <Text style={[styles.metricValue, styles.incomeText]}>
                  {formatCurrency(monthlyMetrics.totalIncome)}
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Gastos Totales:</Text>
                <Text style={[styles.metricValue, styles.expenseText]}>
                  {formatCurrency(monthlyMetrics.totalExpenses)}
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Diferencia:</Text>
                <Text style={[
                  styles.metricValue, 
                  monthlyMetrics.totalIncome - monthlyMetrics.totalExpenses >= 0 
                    ? styles.incomeText 
                    : styles.expenseText
                ]}>
                  {formatCurrency(monthlyMetrics.totalIncome - monthlyMetrics.totalExpenses)}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.cardContent}>
              {isLoading ? "Cargando..." : "No hay datos disponibles"}
            </Text>
          )}
        </View>

        {/* Expense Target Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Objetivo Mensual</Text>
          {expenseTarget ? (
            <View style={styles.metricsContainer}>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Meta de Gastos:</Text>
                <Text style={styles.metricValue}>
                  {formatCurrency(expenseTarget.targetExpense)}
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Porcentaje Actual:</Text>
                <Text style={styles.metricValue}>
                  {expenseTarget.currentExpensePercentage.toFixed(1)}%
                </Text>
              </View>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Superávit:</Text>
                <Text style={[
                  styles.metricValue, 
                  expenseTarget.surplus >= 0 ? styles.incomeText : styles.expenseText
                ]}>
                  {formatCurrency(expenseTarget.surplus)}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.cardContent}>
              {isLoading ? "Cargando..." : "No hay datos disponibles"}
            </Text>
          )}
        </View>

        {/* Recent Transactions Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transacciones Recientes</Text>
          {monthlyTransactions?.transactions?.length > 0 ? (
            <View style={styles.transactionsContainer}>
              {monthlyTransactions.transactions.slice(0, 5).map((transaction: any, index: number) => (
                <View key={index} style={styles.transactionItem}>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>
                      {transaction.description || "Sin descripción"}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {new Date(transaction.date).toLocaleDateString('es-ES')}
                    </Text>
                  </View>
                  <Text style={[
                    styles.transactionAmount,
                    transaction.amount >= 0 ? styles.incomeText : styles.expenseText
                  ]}>
                    {formatCurrency(Math.abs(transaction.amount))}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.cardContent}>
              {isLoading ? "Cargando..." : "No hay transacciones en este período"}
            </Text>
          )}
        </View>

        {/* Annual Chart Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gráfico Anual de Gastos</Text>
          {annualMetrics?.totalExpenses?.length > 0 ? (
            <View style={styles.annualContainer}>
              <Text style={styles.cardContent}>
                Total anual: {formatCurrency(annualMetrics.totalExpenses.reduce((a: number, b: number) => a + b, 0))}
              </Text>
              <Text style={styles.cardContent}>
                Promedio mensual: {formatCurrency(
                  annualMetrics.totalExpenses.reduce((a: number, b: number) => a + b, 0) / 12
                )}
              </Text>
            </View>
          ) : (
            <Text style={styles.cardContent}>
              {isLoading ? "Cargando..." : "No hay datos anuales disponibles"}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  selectors: {
    flexDirection: "row",
    gap: 12,
  },
  selector: {
    minWidth: 120,
  },
  content: {
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  cardContent: {
    fontSize: 14,
    color: "#6B7280",
  },
  metricsContainer: {
    gap: 12,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  incomeText: {
    color: "#22c55e",
  },
  expenseText: {
    color: "#ef4444",
  },
  transactionsContainer: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "600",
  },
  annualContainer: {
    gap: 8,
  },
});