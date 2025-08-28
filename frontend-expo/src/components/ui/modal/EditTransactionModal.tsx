import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateTransaction, fetchAllSubcategories } from '../../../api';
import { Subcategory, Transaction } from '../../../api/expenses/types';
import { useAppTheme } from '../../../theme/useAppTheme';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onSubmit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export default function EditTransactionModal({ 
  isOpen, 
  onClose, 
  transaction, 
  onSubmit,
  onDelete
}: EditTransactionModalProps) {
  const { colors } = useAppTheme();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubcategoryPicker, setShowSubcategoryPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Initialize form with transaction data when modal opens
  useEffect(() => {
    if (transaction && isOpen) {
      setDescription(transaction.description || '');
      setAmount(Math.abs(transaction.amount).toString());
      setDate(new Date(transaction.date));
      setNotes(transaction.notes || '');
      setIsRecurring(transaction.isRecurring);
      setSelectedSubcategory(transaction.subcategory);
      fetchSubcategories();
    }
  }, [transaction, isOpen]);

  const fetchSubcategories = async () => {
    try {
      const data = await fetchAllSubcategories();
      setSubcategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleSubmit = async () => {
    if (!transaction || !description || !amount || !selectedSubcategory) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue === 0) {
      Alert.alert('Error', 'Por favor ingresa un monto válido');
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedTransaction: Transaction = {
        ...transaction,
        description,
        amount: transaction.amount >= 0 ? amountValue : -amountValue, // Preserve sign
        date: date.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
        subcategory: selectedSubcategory,
        isRecurring,
        notes: notes || undefined,
      };

      const response = await updateTransaction(transaction.id, updatedTransaction);
      onSubmit(response);
      handleClose();
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Error al actualizar la transacción');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;
    
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta transacción? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              await onDelete(transaction);
              handleClose();
            } catch (error: any) {
              Alert.alert('Error', error?.response?.data?.message || 'Error al eliminar la transacción');
            }
          }
        }
      ]
    );
  };

  const handleClose = () => {
    setDescription('');
    setAmount('');
    setDate(new Date());
    setNotes('');
    setIsRecurring(false);
    setSelectedSubcategory(null);
    setShowSubcategoryPicker(false);
    setShowDatePicker(false);
    onClose();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent={Platform.OS === 'android'}
      hardwareAccelerated={Platform.OS === 'android'} // Better performance on Android
    >
      <View style={[styles.overlay, { backgroundColor: colors.modalOverlay }]}>
        <View style={[styles.modal, { 
          backgroundColor: colors.modalBackground,
          borderColor: colors.modalBorder 
        }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Editar Transacción
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.form}>
              {/* Description */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>
                  Descripción *
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                    color: colors.inputText 
                  }]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Descripción de la transacción"
                  placeholderTextColor={colors.inputPlaceholder}
                  editable={!isSubmitting}
                />
              </View>

              {/* Amount */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>
                  Monto *
                </Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                    color: colors.inputText 
                  }]}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor={colors.inputPlaceholder}
                  keyboardType="numeric"
                  editable={!isSubmitting}
                />
              </View>

              {/* Date */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>
                  Fecha *
                </Text>
                <TouchableOpacity
                  style={[styles.dateInput, { 
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder 
                  }]}
                  onPress={() => setShowDatePicker(true)}
                  disabled={isSubmitting}
                  activeOpacity={Platform.OS === 'android' ? 0.6 : 0.7}
                >
                  <Text style={[styles.dateText, { color: colors.inputText }]}>
                    {formatDate(date)}
                  </Text>
                  <Ionicons 
                    name="calendar" 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
                
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    style={styles.datePicker}
                  />
                )}
              </View>

              {/* Subcategory */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>
                  Subcategoría *
                </Text>
                <View style={styles.subcategoryContainer}>
                  <TouchableOpacity
                    style={[styles.subcategoryPicker, { 
                      backgroundColor: colors.inputBackground,
                      borderColor: colors.inputBorder 
                    }]}
                    onPress={() => setShowSubcategoryPicker(!showSubcategoryPicker)}
                    disabled={isSubmitting}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.subcategoryText,
                      { color: selectedSubcategory ? colors.textPrimary : colors.inputPlaceholder }
                    ]}>
                      {selectedSubcategory?.name || 'Seleccionar subcategoría'}
                    </Text>
                    <Ionicons 
                      name={showSubcategoryPicker ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color={colors.textSecondary} 
                    />
                  </TouchableOpacity>

                  {showSubcategoryPicker && (
                    <View style={[styles.subcategoryList, { 
                      backgroundColor: colors.surface,
                      borderColor: colors.border 
                    }]}>
                      <ScrollView 
                        style={styles.subcategoryScrollView}
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled={true}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.subcategoryScrollContent}
                        scrollEnabled={true}
                      >
                        {subcategories.map((subcategory) => (
                          <TouchableOpacity
                            key={subcategory.id}
                            style={[styles.subcategoryItem, { 
                              borderBottomColor: colors.borderSecondary 
                            }]}
                            onPress={() => {
                              setSelectedSubcategory(subcategory);
                              setShowSubcategoryPicker(false);
                            }}
                            activeOpacity={0.7}
                          >
                            <Text style={[styles.subcategoryItemText, { color: colors.textPrimary }]}>
                              {subcategory.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>

              {/* Notes */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>
                  Notas
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea, { 
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                    color: colors.inputText 
                  }]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Notas adicionales (opcional)"
                  placeholderTextColor={colors.inputPlaceholder}
                  multiline
                  numberOfLines={3}
                  editable={!isSubmitting}
                />
              </View>

              {/* Recurring Checkbox */}
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setIsRecurring(!isRecurring)}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={isRecurring ? "checkmark-circle" : "ellipse-outline"} 
                  size={24} 
                  color={isRecurring ? colors.info : colors.textSecondary} 
                />
                <Text style={[styles.checkboxLabel, { color: colors.textSecondary }]}>
                  Transacción recurrente
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={[styles.actions, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton, { 
                backgroundColor: colors.error,
                borderColor: colors.error 
              }]}
              onPress={handleDelete}
              disabled={isSubmitting}
              activeOpacity={0.7}
            >
              <Text style={[styles.deleteButtonText, { color: colors.buttonPrimaryText }]}>
                Eliminar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { 
                backgroundColor: colors.surface,
                borderColor: colors.border 
              }]}
              onPress={handleClose}
              disabled={isSubmitting}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.submitButton, { 
                backgroundColor: colors.buttonPrimary 
              }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.7}
            >
              <Text style={[styles.submitButtonText, { color: colors.buttonPrimaryText }]}>
                {isSubmitting ? 'Actualizando...' : 'Actualizar'}
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
    maxWidth: Platform.OS === 'ios' ? 380 : 420,
    maxHeight: Platform.OS === 'ios' ? '90%' : '85%',
    minHeight: Platform.OS === 'ios' ? 650 : 750, // Increased min height
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
  scrollContent: {
    paddingBottom: 20, // Add bottom padding to ensure scrolling works
  },
  form: {
    gap: Platform.OS === 'ios' ? 24 : 28,
    flex: 1,
    paddingBottom: 20, // Add bottom padding to ensure scrolling works
  },
  inputGroup: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: Platform.OS === 'ios' ? 18 : 20,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#d1d5db',
    minHeight: 56,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: Platform.OS === 'ios' ? 18 : 20,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#d1d5db',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 56,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
  },
  datePicker: {
    marginTop: 8,
  },
  subcategoryContainer: {
    position: 'relative',
    zIndex: Platform.OS === 'android' ? 9999 : 1000,
  },
  subcategoryPicker: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: Platform.OS === 'ios' ? 18 : 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    minHeight: 56,
  },
  subcategoryText: {
    fontSize: 16,
    flex: 1,
  },
  subcategoryList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    maxHeight: 200, // Reduced max height
    zIndex: Platform.OS === 'android' ? 9999 : 1001,
    // iOS shadows
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    }),
    // Android elevation
    ...(Platform.OS === 'android' && {
      elevation: 8,
    }),
  },
  subcategoryScrollView: {
    maxHeight: 200, // Match the container height
  },
  subcategoryScrollContent: {
    paddingBottom: 16,
  },
  subcategoryItem: {
    padding: Platform.OS === 'ios' ? 16 : 18, // Reduced padding
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  subcategoryItemText: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '500',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    marginBottom: 16, // Add bottom margin to ensure it's not cut off
  },
  checkboxLabel: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
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
    paddingVertical: Platform.OS === 'ios' ? 18 : 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButton: {
    // Background color is handled dynamically
  },
  cancelButton: {
    borderWidth: 1,
  },
  submitButton: {
    // Background color is handled dynamically
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
