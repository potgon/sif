import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl, Text, TouchableOpacity, Alert as RNAlert, Platform } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Select from "@/src/components/ui/form/Select";
import DropdownSelector from "@/src/components/ui/form/DropdownSelector";
import Alert from "@/src/components/ui/alert/Alert";
import { useAppTheme } from "@/src/theme/useAppTheme";
import { 
  fetchMonthlyMetrics, 
  fetchMonthlyTransactions, 
  fetchMonthlyExpenseTarget,
  fetchAnnualMetrics,
  fetchMonthlySubcategorySumExpenses,
  deleteTransaction
} from "@/src/api";
import {
  AnnualExpensesChart,
  FinanceMetrics,
  MonthlyTarget,
  RecentTransactions,
  StatisticsChart
} from "@/src/components/expenses";
import IncomeModal from "@/src/components/ui/modal/IncomeModal";
import TransactionModal from "@/src/components/ui/modal/TransactionModal";
import AddTransactionModal from "@/src/components/ui/modal/AddTransactionModal";
import EditTransactionModal from "@/src/components/ui/modal/EditTransactionModal";

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
  const { colors } = useAppTheme();
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11, so +1 gives us 1-12
  const currentYear = now.getFullYear();
  
  console.log('Home: Current date - Month:', currentMonth, 'Year:', currentYear);
  
  const [selectedMonth, setSelectedMonth] = useState(String(currentMonth));
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const [monthlyMetrics, setMonthlyMetrics] = useState<any>(null);
  const [monthlyTransactions, setMonthlyTransactions] = useState<any>(null);
  const [expenseTarget, setExpenseTarget] = useState<any>(null);
  const [annualMetrics, setAnnualMetrics] = useState<any>(null);
  const [categoryExpenses, setCategoryExpenses] = useState<any>(null);

  // Modal states
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [isEditTransactionModalOpen, setIsEditTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Fetch data when authenticated and year/month changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [selectedYear, selectedMonth, isAuthenticated]);

  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        router.replace('/sign-in');
        return;
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      router.replace('/sign-in');
    }
  };

  const fetchData = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching data for:', selectedYear, selectedMonth);
      
      const [metrics, transactions, target, annual, categories] = await Promise.all([
        fetchMonthlyMetrics(parseInt(selectedYear), parseInt(selectedMonth)),
        fetchMonthlyTransactions(parseInt(selectedYear), parseInt(selectedMonth)),
        fetchMonthlyExpenseTarget(parseInt(selectedYear), parseInt(selectedMonth)),
        fetchAnnualMetrics(parseInt(selectedYear)),
        fetchMonthlySubcategorySumExpenses(parseInt(selectedYear), parseInt(selectedMonth))
      ]);
      
      console.log('API Responses:');
      console.log('Metrics:', metrics);
      console.log('Transactions:', transactions);
      console.log('Target:', target);
      console.log('Annual:', annual);
      console.log('Categories:', categories);
      
      setMonthlyMetrics(metrics);
      setMonthlyTransactions(transactions);
      setExpenseTarget(target);
      setAnnualMetrics(annual);
      setCategoryExpenses(categories);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      console.error('Error response:', err?.response);
      
      // Handle authentication errors
      if (err?.response?.status === 401) {
        setError('Sesión expirada. Por favor inicia sesión nuevamente.');
        await AsyncStorage.removeItem('token');
        router.replace('/sign-in');
        return;
      }
      
      setError(err?.response?.data?.message || "Error al cargar los datos");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Modal handlers
  const handleIncomePress = () => {
    setIsIncomeModalOpen(true);
  };

  const handleTransactionPress = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleAddTransaction = () => {
    setIsAddTransactionModalOpen(true);
  };

  const handleTransactionEdit = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsEditTransactionModalOpen(true);
    setIsTransactionModalOpen(false);
  };

  const handleTransactionDelete = async (transaction: any) => {
    try {
      const response = await deleteTransaction(transaction.id);
      if (response.result) {
        console.log('Transaction deleted successfully');
        fetchData(); // Refresh data after deletion
      } else {
        console.error('Failed to delete transaction:', response.message);
        setError(`Error al eliminar: ${response.message}`);
      }
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      setError('Error al eliminar la transacción');
    }
    setIsTransactionModalOpen(false);
  };

  const handleTransactionCreated = (newTransaction: any) => {
    console.log('Transaction created:', newTransaction);
    fetchData(); // Refresh data after creation
  };

  const handleTransactionUpdated = (updatedTransaction: any) => {
    console.log('Transaction updated:', updatedTransaction);
    fetchData(); // Refresh data after update
  };

  const handleMonthChange = (month: string) => {
    console.log('Home: Month changed from', selectedMonth, 'to', month);
    setSelectedMonth(month);
  };

  const handleYearChange = (year: string) => {
    console.log('Home: Year changed from', selectedYear, 'to', year);
    setSelectedYear(year);
  };

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textPrimary }]}>Verificando autenticación...</Text>
      </View>
    );
  }

  // Don't render anything if not authenticated (will redirect to sign-in)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.selectors}>
          <View style={styles.selector}>
            <DropdownSelector
              options={years}
              value={selectedYear}
              onChange={handleYearChange}
              placeholder="Seleccionar año"
            />
          </View>

          <View style={styles.selector}>
            <DropdownSelector
              options={months}
              value={selectedMonth}
              onChange={handleMonthChange}
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
        {/* Finance Metrics */}
        <FinanceMetrics
          year={parseInt(selectedYear)}
          month={parseInt(selectedMonth)}
          data={monthlyMetrics}
          loading={isLoading}
          onIncomePress={handleIncomePress}
        />

        {/* Monthly Target */}
        <MonthlyTarget
          year={parseInt(selectedYear)}
          month={parseInt(selectedMonth)}
          data={expenseTarget}
          loading={isLoading}
        />

        {/* Annual Expenses Chart */}
        <AnnualExpensesChart
          year={parseInt(selectedYear)}
          data={annualMetrics?.totalExpenses || []}
          loading={isLoading}
        />

        {/* Statistics Chart */}
        <StatisticsChart
          year={parseInt(selectedYear)}
          month={parseInt(selectedMonth)}
          data={categoryExpenses?.subcategoryExpenses || []}
          loading={isLoading}
        />

        {/* Recent Transactions */}
        <RecentTransactions
          year={parseInt(selectedYear)}
          month={parseInt(selectedMonth)}
          transactions={monthlyTransactions?.transactions || []}
          loading={isLoading}
          onTransactionPress={handleTransactionPress}
          onAddPress={handleAddTransaction}
        />
      </View>

      {/* Modals */}
      <IncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        year={parseInt(selectedYear)}
        month={parseInt(selectedMonth)}
        refreshData={fetchData}
      />

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => {
          setIsTransactionModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
        onEdit={handleTransactionEdit}
        onDelete={handleTransactionDelete}
      />

      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        year={parseInt(selectedYear)}
        month={parseInt(selectedMonth)}
        onSubmit={handleTransactionCreated}
      />

      <EditTransactionModal
        isOpen={isEditTransactionModalOpen}
        onClose={() => {
          setIsEditTransactionModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
        onSubmit={handleTransactionUpdated}
        onDelete={handleTransactionDelete}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Platform.OS === 'ios' ? 16 : 20,
    paddingHorizontal: Platform.OS === 'ios' ? 16 : 20,
    paddingTop: Platform.OS === 'ios' ? 16 : 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 24,
    borderRadius: 16,
    marginHorizontal: Platform.OS === 'ios' ? 16 : 20,
    marginTop: Platform.OS === 'ios' ? 16 : 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: Platform.OS === 'android' ? 8 : 0, // Android elevation, iOS shadow
  },
  selectors: {
    flexDirection: "row",
    gap: Platform.OS === 'ios' ? 16 : 20,
    alignItems: 'center',
  },
  selector: {
    minWidth: Platform.OS === 'ios' ? 140 : 150, // Android needs slightly more width
  },
  content: {
    gap: Platform.OS === 'ios' ? 16 : 20,
    paddingHorizontal: Platform.OS === 'ios' ? 16 : 20,
    paddingBottom: Platform.OS === 'ios' ? 16 : 20,
    alignItems: 'stretch',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
  debugButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#4f46e5', // A bright blue for debugging
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});