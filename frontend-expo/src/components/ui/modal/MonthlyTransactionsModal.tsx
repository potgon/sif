import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';
import { fetchMonthlyTransactions } from '../../../api/expenses/transactions';
import { Transaction } from '../../../api/expenses/types';

interface MonthlyTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  monthName: string;
}

export default function MonthlyTransactionsModal({ 
  isOpen, 
  onClose, 
  year, 
  month, 
  monthName 
}: MonthlyTransactionsModalProps) {
  const { colors } = useAppTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && year && month) {
      loadTransactions();
    }
  }, [isOpen, year, month]);

  const loadTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMonthlyTransactions(year, month);
      setTransactions(data.transactions || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cargar las transacciones');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `€${amount.toFixed(2)}`;
  };

  const getTransactionIcon = (categoryType: any) => {
    // Handle both string and object cases
    const type = typeof categoryType === 'string' ? categoryType : categoryType?.categoryType || categoryType;
    
    switch (type) {
      case 'EXPENSE':
        return 'trending-down';
      case 'INCOME':
        return 'trending-up';
      case 'INVERSION':
        return 'trending-up';
      case 'DEBT':
        return 'card';
      default:
        return 'cash';
    }
  };

  const getTransactionColor = (categoryType: any) => {
    // Handle both string and object cases
    const type = typeof categoryType === 'string' ? categoryType : categoryType?.categoryType || categoryType;
    
    switch (type) {
      case 'EXPENSE':
        return '#ef4444'; // Red
      case 'INCOME':
        return '#10b981'; // Green
      case 'INVERSION':
        return '#3b82f6'; // Blue
      case 'DEBT':
        return '#f59e0b'; // Yellow
      default:
        return '#6b7280'; // Gray
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.modalOverlay }]}>
        <View style={[styles.modal, { 
          backgroundColor: colors.modalBackground,
          borderColor: colors.modalBorder 
        }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerContent}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Transacciones de {monthName}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {year}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.buttonPrimary} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                  Cargando transacciones...
                </Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={48} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.textSecondary }]}>
                  {error}
                </Text>
                <TouchableOpacity
                  style={[styles.retryButton, { backgroundColor: colors.buttonPrimary }]}
                  onPress={loadTransactions}
                >
                  <Text style={[styles.retryButtonText, { color: colors.buttonPrimaryText }]}>
                    Reintentar
                  </Text>
                </TouchableOpacity>
              </View>
            ) : transactions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text" size={48} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No hay transacciones para {monthName} {year}
                </Text>
              </View>
            ) : (
              <ScrollView 
                style={styles.transactionsList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.transactionsContent}
              >
                {transactions.map((transaction) => (
                  <View 
                    key={transaction.id} 
                    style={[styles.transactionItem, { 
                      backgroundColor: colors.surface,
                      borderColor: colors.borderSecondary 
                    }]}
                  >
                    <View style={styles.transactionHeader}>
                      <View style={styles.transactionIconContainer}>
                        <Ionicons 
                          name={getTransactionIcon(transaction.category) as any}
                          size={20} 
                          color={getTransactionColor(transaction.category)} 
                        />
                      </View>
                      <View style={styles.transactionInfo}>
                        <Text style={[styles.transactionDescription, { color: colors.textPrimary }]} numberOfLines={2}>
                          {transaction.description || 'Sin descripción'}
                        </Text>
                        <Text style={[styles.transactionSubcategory, { color: colors.textSecondary }]}>
                          {transaction.subcategory.name}
                        </Text>
                      </View>
                      <View style={styles.transactionAmount}>
                        <Text style={[
                          styles.amountText, 
                          { color: getTransactionColor(transaction.category) }
                        ]}>
                          {formatCurrency(transaction.amount)}
                        </Text>
                        <Text style={[styles.dateText, { color: colors.textMuted }]}>
                          {formatDate(transaction.date)}
                        </Text>
                      </View>
                    </View>
                    {transaction.notes && (
                      <Text style={[styles.notesText, { color: colors.textMuted }]} numberOfLines={2}>
                        {transaction.notes}
                      </Text>
                    )}
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <View style={styles.summary}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Total de Transacciones:
              </Text>
              <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
                {transactions.length}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.closeModalButton, { backgroundColor: colors.buttonPrimary }]}
              onPress={onClose}
            >
              <Text style={[styles.closeModalButtonText, { color: colors.buttonPrimaryText }]}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Platform.OS === 'ios' ? 20 : 24,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '100%',
    maxWidth: Platform.OS === 'ios' ? 400 : 450,
    maxHeight: Platform.OS === 'ios' ? '90%' : '85%',
    minHeight: Platform.OS === 'ios' ? 600 : 650,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Platform.OS === 'ios' ? 24 : 28,
    paddingBottom: Platform.OS === 'ios' ? 20 : 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: Platform.OS === 'ios' ? 24 : 28,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    paddingHorizontal: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6b7280',
    paddingHorizontal: 20,
  },
  transactionsList: {
    flex: 1,
  },
  transactionsContent: {
    gap: 16,
    paddingBottom: 20,
  },
  transactionItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
    gap: 4,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  transactionSubcategory: {
    fontSize: 14,
    color: '#6b7280',
  },
  transactionAmount: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  notesText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    paddingLeft: 56, // Align with transaction info
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Platform.OS === 'ios' ? 24 : 28,
    paddingTop: Platform.OS === 'ios' ? 20 : 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  summary: {
    alignItems: 'flex-start',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  closeModalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
