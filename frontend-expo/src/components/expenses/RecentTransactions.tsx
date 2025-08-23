import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme/useAppTheme';

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
  const { colors } = useAppTheme();
  
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
    return amount >= 0 ? colors.success : colors.error;
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Transacciones Recientes</Text>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Cargando transacciones...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
          Transacciones Recientes
        </Text>
        {onAddPress && (
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.buttonPrimary }]} 
            onPress={onAddPress}
          >
            <Ionicons name="add" size={20} color={colors.buttonPrimaryText} />
            <Text style={[styles.addButtonText, { color: colors.buttonPrimaryText }]}>Añadir</Text>
          </TouchableOpacity>
        )}
      </View>

      {transactions && transactions.length > 0 ? (
        <ScrollView style={styles.transactionsContainer} showsVerticalScrollIndicator={false}>
          {transactions.slice(0, 10).map((transaction, index) => (
            <TouchableOpacity
              key={transaction.id || index}
              style={[styles.transactionItem, { 
                backgroundColor: colors.surface,
                borderBottomColor: colors.borderSecondary 
              }]}
              onPress={() => onTransactionPress?.(transaction)}
              disabled={!onTransactionPress}
            >
              <View style={[styles.transactionIcon, { 
                backgroundColor: getTransactionColor(transaction.amount) + '20' 
              }]}>
                <Ionicons 
                  name={getTransactionIcon(transaction.amount)} 
                  size={24} 
                  color={getTransactionColor(transaction.amount)} 
                />
              </View>
              
              <View style={styles.transactionContent}>
                <Text style={[styles.transactionDescription, { color: colors.textPrimary }]} numberOfLines={2}>
                  {transaction.description || 'Sin descripción'}
                </Text>
                <Text style={[styles.transactionSubcategory, { color: colors.textSecondary }]} numberOfLines={1}>
                  {transaction.subcategory?.name || 'Sin subcategoría'}
                </Text>
                <Text style={[styles.transactionDate, { color: colors.textMuted }]}>
                  {formatDate(transaction.date)}
                </Text>
              </View>
              
              <View style={styles.transactionAmount}>
                <Text style={[
                  styles.amountText,
                  { color: getTransactionColor(transaction.amount) }
                ]}>
                  {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noDataContainer}>
          <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.noDataText, { color: colors.textSecondary }]}>
            No hay transacciones para {monthNames[month - 1]} {year}
          </Text>
          <Text style={[styles.noDataSubtext, { color: colors.textMuted }]}>
            Añade tu primera transacción para comenzar
          </Text>
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 16 : 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 8 : 10,
    paddingHorizontal: Platform.OS === 'ios' ? 12 : 16,
    borderRadius: 8,
    gap: Platform.OS === 'ios' ? 6 : 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionsContainer: {
    maxHeight: 300,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 12 : 16,
    paddingHorizontal: Platform.OS === 'ios' ? 12 : 16,
    borderRadius: 12,
    marginBottom: Platform.OS === 'ios' ? 8 : 10,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionContent: {
    flex: 1,
    marginRight: 16,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionSubcategory: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
