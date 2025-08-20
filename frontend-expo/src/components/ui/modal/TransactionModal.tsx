import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';

interface Transaction {
  id: number;
  description?: string;
  amount: number;
  date: string;
  subcategory?: {
    name?: string;
  };
  notes?: string;
  isRecurring: boolean;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export default function TransactionModal({ 
  isOpen, 
  onClose, 
  transaction, 
  onEdit, 
  onDelete 
}: TransactionModalProps) {
  const { colors } = useAppTheme();
  
  if (!transaction) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTransactionIcon = (amount: number) => {
    if (amount >= 0) {
      return 'arrow-down-circle' as const;
    } else {
      return 'arrow-up-circle' as const;
    }
  };

  const getTransactionColor = (amount: number) => {
    return amount >= 0 ? colors.success : colors.error;
  };

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
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Detalles de Transacción
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Transaction Icon and Amount */}
            <View style={styles.amountSection}>
              <View style={[
                styles.transactionIcon,
                { backgroundColor: getTransactionColor(transaction.amount) + '20' }
              ]}>
                <Ionicons 
                  name={getTransactionIcon(transaction.amount)} 
                  size={32} 
                  color={getTransactionColor(transaction.amount)} 
                />
              </View>
              <Text style={[
                styles.amount,
                { color: getTransactionColor(transaction.amount) }
              ]}>
                {transaction.amount >= 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
              </Text>
              <Text style={[styles.transactionType, { color: colors.textSecondary }]}>
                {transaction.amount >= 0 ? 'Ingreso' : 'Gasto'}
              </Text>
            </View>

            {/* Transaction Details */}
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Ionicons name="document-text" size={20} color={colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Descripción</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                    {transaction.description || 'Sin descripción'}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="calendar" size={20} color={colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Fecha</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{formatDate(transaction.date)}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="pricetag" size={20} color={colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Subcategoría</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                    {transaction.subcategory?.name || 'Sin categoría'}
                  </Text>
                </View>
              </View>

              {transaction.notes && (
                <View style={styles.detailRow}>
                  <Ionicons name="chatbubble" size={20} color={colors.textSecondary} />
                  <View style={styles.detailContent}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Notas</Text>
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>{transaction.notes}</Text>
                  </View>
                </View>
              )}

              <View style={styles.detailRow}>
                <Ionicons name="repeat" size={20} color={colors.textSecondary} />
                <View style={styles.detailContent}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Recurrente</Text>
                  <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                    {transaction.isRecurring ? 'Sí' : 'No'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={[styles.actions, { borderTopColor: colors.border }]}>
            {onDelete && (
              <TouchableOpacity
                style={[styles.button, styles.deleteButton, { backgroundColor: colors.error }]}
                onPress={() => onDelete(transaction)}
              >
                <Ionicons name="trash" size={20} color={colors.buttonPrimaryText} />
                <Text style={[styles.deleteButtonText, { color: colors.buttonPrimaryText }]}>Eliminar</Text>
              </TouchableOpacity>
            )}
            
            {onEdit && (
              <TouchableOpacity
                style={[styles.button, styles.editButton, { backgroundColor: colors.buttonPrimary }]}
                onPress={() => onEdit(transaction)}
              >
                <Ionicons name="pencil" size={20} color={colors.buttonPrimaryText} />
                <Text style={[styles.editButtonText, { color: colors.buttonPrimaryText }]}>Editar</Text>
              </TouchableOpacity>
            )}
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
    maxWidth: Platform.OS === 'ios' ? 380 : 420,
    maxHeight: Platform.OS === 'ios' ? '85%' : '80%',
    minHeight: Platform.OS === 'ios' ? 500 : 550,
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
    alignItems: 'center',
    padding: Platform.OS === 'ios' ? 24 : 28,
    paddingBottom: Platform.OS === 'ios' ? 20 : 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: Platform.OS === 'ios' ? 24 : 28,
    paddingTop: Platform.OS === 'ios' ? 20 : 24,
    flex: 1,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 36,
    paddingVertical: 28,
  },
  transactionIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 12,
  },
  transactionType: {
    fontSize: 18,
    fontWeight: '500',
  },
  detailsSection: {
    gap: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '400',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    padding: Platform.OS === 'ios' ? 24 : 28,
    paddingTop: Platform.OS === 'ios' ? 20 : 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Platform.OS === 'ios' ? 18 : 20,
    borderRadius: 12,
    gap: 10,
  },
  deleteButton: {
    // Background color is handled dynamically
  },
  editButton: {
    // Background color is handled dynamically
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
