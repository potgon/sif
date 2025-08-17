import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Transaction {
  id: number;
  description?: string;
  amount: number;
  date: string;
  subcategory?: {
    name?: string;
  };
}

interface RecentTransactionsProps {
  year: number;
  month: number;
  transactions: Transaction[];
  loading?: boolean;
  onTransactionPress?: (transaction: Transaction) => void;
  onAddPress?: () => void;
}

export default function RecentTransactions({ 
  year, 
  month, 
  transactions, 
  loading = false,
  onTransactionPress,
  onAddPress
}: RecentTransactionsProps) {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTransactionIcon = (amount: number) => {
    if (amount >= 0) {
      return 'arrow-down-circle' as const; // Income
    } else {
      return 'arrow-up-circle' as const; // Expense
    }
  };

  const getTransactionColor = (amount: number) => {
    return amount >= 0 ? '#22c55e' : '#ef4444';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Transacciones Recientes</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando transacciones...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transacciones Recientes - {monthNames[month - 1]} {year}</Text>
        {onAddPress && (
          <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
            <Ionicons name="add" size={20} color="#ffffff" />
            <Text style={styles.addButtonText}>Añadir</Text>
          </TouchableOpacity>
        )}
      </View>

      {transactions && transactions.length > 0 ? (
        <ScrollView style={styles.transactionsContainer} showsVerticalScrollIndicator={false}>
          {transactions.slice(0, 10).map((transaction, index) => (
            <TouchableOpacity
              key={transaction.id || index}
              style={styles.transactionItem}
              onPress={() => onTransactionPress?.(transaction)}
              disabled={!onTransactionPress}
            >
              <View style={styles.transactionIcon}>
                <Ionicons 
                  name={getTransactionIcon(transaction.amount)} 
                  size={24} 
                  color={getTransactionColor(transaction.amount)} 
                />
              </View>
              
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription} numberOfLines={2}>
                  {transaction.description || 'Sin descripción'}
                </Text>
                <View style={styles.transactionMeta}>
                  <Text style={styles.transactionDate}>
                    {formatDate(transaction.date)}
                  </Text>
                  {transaction.subcategory?.name && (
                    <Text style={styles.transactionCategory}>
                      {transaction.subcategory.name}
                    </Text>
                  )}
                </View>
              </View>
              
              <View style={styles.transactionAmount}>
                <Text style={[
                  styles.amountText,
                  { color: getTransactionColor(transaction.amount) }
                ]}>
                  {transaction.amount >= 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
                </Text>
                <Text style={styles.amountType}>
                  {transaction.amount >= 0 ? 'Ingreso' : 'Gasto'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noTransactionsContainer}>
          <Ionicons name="receipt-outline" size={48} color="#9ca3af" />
          <Text style={styles.noTransactionsText}>
            No hay transacciones en {monthNames[month - 1]} {year}
          </Text>
          <Text style={styles.noTransactionsSubtext}>
            Comienza añadiendo tu primera transacción
          </Text>
        </View>
      )}

      {transactions && transactions.length > 10 && (
        <View style={styles.moreTransactions}>
          <Text style={styles.moreTransactionsText}>
            Y {transactions.length - 10} transacciones más...
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
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
  transactionsContainer: {
    maxHeight: 400,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
    marginRight: 16,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  transactionCategory: {
    fontSize: 12,
    color: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  amountType: {
    fontSize: 10,
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  noTransactionsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noTransactionsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cbd5e1',
    marginTop: 16,
    marginBottom: 8,
  },
  noTransactionsSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  moreTransactions: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  moreTransactionsText: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
});
