import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    return amount >= 0 ? '#22c55e' : '#ef4444';
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Detalles de Transacción</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
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
              <Text style={styles.transactionType}>
                {transaction.amount >= 0 ? 'Ingreso' : 'Gasto'}
              </Text>
            </View>

            {/* Transaction Details */}
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Ionicons name="document-text" size={20} color="#6b7280" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Descripción</Text>
                  <Text style={styles.detailValue}>
                    {transaction.description || 'Sin descripción'}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="calendar" size={20} color="#6b7280" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Fecha</Text>
                  <Text style={styles.detailValue}>{formatDate(transaction.date)}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="pricetag" size={20} color="#6b7280" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Subcategoría</Text>
                  <Text style={styles.detailValue}>
                    {transaction.subcategory?.name || 'Sin categoría'}
                  </Text>
                </View>
              </View>

              {transaction.notes && (
                <View style={styles.detailRow}>
                  <Ionicons name="chatbubble" size={20} color="#6b7280" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Notas</Text>
                    <Text style={styles.detailValue}>{transaction.notes}</Text>
                  </View>
                </View>
              )}

              <View style={styles.detailRow}>
                <Ionicons name="repeat" size={20} color="#6b7280" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Recurrente</Text>
                  <Text style={styles.detailValue}>
                    {transaction.isRecurring ? 'Sí' : 'No'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actions}>
            {onDelete && (
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => onDelete(transaction)}
              >
                <Ionicons name="trash" size={20} color="#ffffff" />
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            )}
            
            {onEdit && (
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => onEdit(transaction)}
              >
                <Ionicons name="pencil" size={20} color="#ffffff" />
                <Text style={styles.editButtonText}>Editar</Text>
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
  },
  modal: {
    backgroundColor: '#1f2937',
    borderRadius: 20,
    width: '95%',
    maxWidth: 450,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 24,
    paddingTop: 16,
  },
  amountSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  transactionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  transactionType: {
    fontSize: 16,
    color: '#9ca3af',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  detailsSection: {
    gap: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  editButton: {
    backgroundColor: '#3b82f6',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
