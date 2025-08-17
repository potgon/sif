import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createTransaction, fetchAllSubcategories } from '../../../api';
import { Subcategory } from '../../../api';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  onSubmit: (transaction: any) => void;
}

export default function AddTransactionModal({ 
  isOpen, 
  onClose, 
  year, 
  month, 
  onSubmit 
}: AddTransactionModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubcategoryPicker, setShowSubcategoryPicker] = useState(false);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  useEffect(() => {
    if (isOpen) {
      fetchSubcategories();
    }
  }, [isOpen]);

  const fetchSubcategories = async () => {
    try {
      const data = await fetchAllSubcategories();
      setSubcategories(data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const handleSubmit = async () => {
    if (!description || !amount || !selectedSubcategory) {
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
      const newTransaction = {
        year,
        month,
        date,
        amount: amountValue,
        description,
        subcategory: selectedSubcategory,
        isRecurring,
        notes: notes || undefined,
      };

      const response = await createTransaction(newTransaction);
      onSubmit(response);
      handleClose();
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Error al crear la transacción');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setIsRecurring(false);
    setSelectedSubcategory(null);
    setShowSubcategoryPicker(false);
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Nueva Transacción</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.subtitle}>
              {monthNames[month - 1]} {year}
            </Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descripción *</Text>
                <TextInput
                  style={styles.input}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Descripción de la transacción"
                  editable={!isSubmitting}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Monto (€) *</Text>
                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  keyboardType="numeric"
                  editable={!isSubmitting}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fecha *</Text>
                <TextInput
                  style={styles.input}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                  editable={!isSubmitting}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Subcategoría *</Text>
                <TouchableOpacity
                  style={styles.subcategoryPicker}
                  onPress={() => setShowSubcategoryPicker(!showSubcategoryPicker)}
                  disabled={isSubmitting}
                >
                  <Text style={[
                    styles.subcategoryText,
                    { color: selectedSubcategory ? '#ffffff' : '#9ca3af' }
                  ]}>
                    {selectedSubcategory?.name || 'Seleccionar subcategoría'}
                  </Text>
                  <Ionicons 
                    name={showSubcategoryPicker ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>

                {showSubcategoryPicker && (
                  <View style={styles.subcategoryList}>
                    {subcategories.map((subcategory) => (
                      <TouchableOpacity
                        key={subcategory.id}
                        style={styles.subcategoryItem}
                        onPress={() => {
                          setSelectedSubcategory(subcategory);
                          setShowSubcategoryPicker(false);
                        }}
                      >
                        <Text style={styles.subcategoryItemText}>{subcategory.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notas</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Notas adicionales (opcional)"
                  multiline
                  numberOfLines={3}
                  editable={!isSubmitting}
                />
              </View>

              <TouchableOpacity
                style={[styles.checkbox, isRecurring && styles.checkboxChecked]}
                onPress={() => setIsRecurring(!isRecurring)}
                disabled={isSubmitting}
              >
                <Ionicons 
                  name={isRecurring ? "checkmark-circle" : "ellipse-outline"} 
                  size={24} 
                  color={isRecurring ? "#3b82f6" : "#6b7280"} 
                />
                <Text style={styles.checkboxLabel}>Transacción recurrente</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Creando...' : 'Crear Transacción'}
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
  },
  modal: {
    backgroundColor: '#1f2937',
    borderRadius: 20,
    width: '95%',
    maxWidth: 450,
    maxHeight: '90%',
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
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d1d5db',
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  subcategoryPicker: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  subcategoryText: {
    fontSize: 16,
    flex: 1,
  },
  subcategoryList: {
    backgroundColor: '#374151',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4b5563',
    maxHeight: 200,
  },
  subcategoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#4b5563',
  },
  subcategoryItemText: {
    color: '#ffffff',
    fontSize: 16,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  checkboxChecked: {
    // Additional styles for checked state
  },
  checkboxLabel: {
    color: '#d1d5db',
    fontSize: 16,
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
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
  },
  cancelButtonText: {
    color: '#d1d5db',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
