import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert as RNAlert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Select from '@/src/components/ui/form/Select';
import Button from '@/src/components/ui/button/Buton';
import Alert from '@/src/components/ui/alert/Alert';
import { 
  fetchMonthlyTransactions, 
  fetchAllSubcategories,
  createTransaction,
  updateTransaction,
  deleteTransaction 
} from '@/src/api';

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

export default function TransactionsTab() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [alert, setAlert] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    date: new Date(),
    subcategory: null,
    isRecurring: false,
    notes: ''
  });

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [transactionsData, subcategoriesData] = await Promise.all([
        fetchMonthlyTransactions(parseInt(selectedYear), parseInt(selectedMonth)),
        fetchAllSubcategories()
      ]);
      
      setTransactions(transactionsData.transactions || []);
      setSubcategories(subcategoriesData || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al cargar las transacciones");
      console.error("Error fetching transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [selectedYear, selectedMonth]);

  const handleAddTransaction = async () => {
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.subcategory) {
      setAlert({
        variant: "error",
        title: "Error",
        message: "Por favor completa todos los campos obligatorios",
      });
      return;
    }

    try {
      const transactionData = {
        year: parseInt(selectedYear),
        month: parseInt(selectedMonth),
        date: newTransaction.date.toISOString().split('T')[0],
        amount: parseFloat(newTransaction.amount),
        description: newTransaction.description,
        subcategory: newTransaction.subcategory,
        isRecurring: newTransaction.isRecurring,
        notes: newTransaction.notes
      };

      await createTransaction(transactionData);
      
      setAlert({
        variant: "success",
        title: "Éxito",
        message: "Transacción creada correctamente",
      });

      // Reset form and refresh data
      setNewTransaction({
        description: '',
        amount: '',
        date: new Date(),
        subcategory: null,
        isRecurring: false,
        notes: ''
      });
      setShowAddForm(false);
      
      setTimeout(() => {
        fetchTransactions();
        setAlert(null);
      }, 1000);
    } catch (err: any) {
      setAlert({
        variant: "error",
        title: "Error",
        message: err?.response?.data?.message || "Error al crear la transacción",
      });
    }
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    RNAlert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que quieres eliminar esta transacción?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTransaction(transactionId);
              setAlert({
                variant: "success",
                title: "Éxito",
                message: "Transacción eliminada correctamente",
              });
              setTimeout(() => {
                fetchTransactions();
                setAlert(null);
              }, 1000);
            } catch (err: any) {
              setAlert({
                variant: "error",
                title: "Error",
                message: err?.response?.data?.message || "Error al eliminar la transacción",
              });
            }
          }
        }
      ]
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Transacciones</Text>
        
        <View style={styles.selectors}>
          <View style={styles.selector}>
            <Select
              options={years}
              value={selectedYear}
              onChange={setSelectedYear}
              placeholder="Año"
            />
          </View>
          <View style={styles.selector}>
            <Select
              options={months}
              value={selectedMonth}
              onChange={setSelectedMonth}
              placeholder="Mes"
            />
          </View>
        </View>
      </View>

      {alert && (
        <Alert
          variant={alert.variant}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {error && (
        <Alert
          variant="error"
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <View style={styles.content}>
        {/* Add Transaction Button */}
        <View style={styles.addButtonContainer}>
          <Button 
            onPress={() => setShowAddForm(!showAddForm)}
            startIcon={<Ionicons name="add" size={20} color="white" />}
          >
            {showAddForm ? "Cancelar" : "Nueva Transacción"}
          </Button>
        </View>

        {/* Add Transaction Form */}
        {showAddForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Nueva Transacción</Text>
            
                         <View style={styles.formRow}>
               <View style={styles.formField}>
                 <Text style={styles.formLabel}>Descripción *</Text>
                 <TextInput
                   style={styles.formInput}
                   placeholder="Descripción de la transacción"
                   value={newTransaction.description}
                   onChangeText={(text: string) => setNewTransaction({...newTransaction, description: text})}
                 />
               </View>
             </View>

             <View style={styles.formRow}>
               <View style={styles.formField}>
                 <Text style={styles.formLabel}>Monto *</Text>
                 <TextInput
                   style={styles.formInput}
                   placeholder="0.00"
                   keyboardType="numeric"
                   value={newTransaction.amount}
                   onChangeText={(text: string) => setNewTransaction({...newTransaction, amount: text})}
                 />
               </View>
               <View style={styles.formField}>
                 <Text style={styles.formLabel}>Subcategoría *</Text>
                 <Select
                   options={subcategories.map((sub: any) => ({ label: sub.name, value: sub.id.toString() }))}
                   value={newTransaction.subcategory?.id?.toString() || ''}
                   onChange={(value) => {
                     const subcategory = subcategories.find((sub: any) => sub.id.toString() === value);
                     setNewTransaction({...newTransaction, subcategory});
                   }}
                   placeholder="Seleccionar subcategoría"
                 />
               </View>
             </View>

             <View style={styles.formRow}>
               <View style={styles.formField}>
                 <Text style={styles.formLabel}>Fecha</Text>
                 <TextInput
                   style={styles.formInput}
                   placeholder="YYYY-MM-DD"
                   value={newTransaction.date.toISOString().split('T')[0]}
                   onChangeText={(text: string) => {
                     if (text.match(/^\d{4}-\d{2}-\d{2}$/)) {
                       setNewTransaction({...newTransaction, date: new Date(text)});
                     }
                   }}
                 />
               </View>
               <View style={styles.formField}>
                 <Text style={styles.formLabel}>Recurrente</Text>
                 <TouchableOpacity
                   style={[styles.checkbox, newTransaction.isRecurring && styles.checkboxChecked]}
                   onPress={() => setNewTransaction({...newTransaction, isRecurring: !newTransaction.isRecurring})}
                 >
                   {newTransaction.isRecurring && (
                     <Ionicons name="checkmark" size={16} color="white" />
                   )}
                 </TouchableOpacity>
               </View>
             </View>

             <View style={styles.formRow}>
               <View style={styles.formField}>
                 <Text style={styles.formLabel}>Notas</Text>
                 <TextInput
                   style={styles.textArea}
                   placeholder="Notas adicionales"
                   value={newTransaction.notes}
                   onChangeText={(text: string) => setNewTransaction({...newTransaction, notes: text})}
                   multiline
                   numberOfLines={3}
                 />
               </View>
             </View>

            <Button onPress={handleAddTransaction} style={styles.submitButton}>
              Crear Transacción
            </Button>
          </View>
        )}

        {/* Transactions List */}
        <View style={styles.transactionsCard}>
          <Text style={styles.cardTitle}>
            Transacciones ({transactions.length})
          </Text>
          
          {isLoading ? (
            <Text style={styles.loadingText}>Cargando transacciones...</Text>
          ) : transactions.length > 0 ? (
            <View style={styles.transactionsList}>
              {transactions.map((transaction, index) => (
                <View key={transaction.id || index} style={styles.transactionItem}>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>
                      {transaction.description || "Sin descripción"}
                    </Text>
                    <Text style={styles.transactionSubcategory}>
                      {transaction.subcategory?.name || "Sin subcategoría"}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {formatDate(transaction.date)}
                    </Text>
                    {transaction.notes && (
                      <Text style={styles.transactionNotes}>
                        {transaction.notes}
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.transactionActions}>
                    <Text style={[
                      styles.transactionAmount,
                      transaction.amount >= 0 ? styles.incomeText : styles.expenseText
                    ]}>
                      {formatCurrency(Math.abs(transaction.amount))}
                    </Text>
                    
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setEditingTransaction(transaction)}
                      >
                        <Ionicons name="pencil" size={16} color="#6b7280" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDeleteTransaction(transaction.id)}
                      >
                        <Ionicons name="trash" size={16} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>
              No hay transacciones en este período
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
    minWidth: 100,
  },
  content: {
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  addButtonContainer: {
    alignItems: "center",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  formField: {
    flex: 1,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  formInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    textAlignVertical: "top",
  },
  checkbox: {
    marginTop: 8,
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  checkboxChecked: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  submitButton: {
    marginTop: 8,
  },
  transactionsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
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
  loadingText: {
    textAlign: "center",
    color: "#6b7280",
    fontStyle: "italic",
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7280",
    fontStyle: "italic",
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  transactionInfo: {
    flex: 1,
    marginRight: 16,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 4,
  },
  transactionSubcategory: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 4,
  },
  transactionNotes: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
  },
  transactionActions: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  incomeText: {
    color: "#22c55e",
  },
  expenseText: {
    color: "#ef4444",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#f3f4f6",
  },
});