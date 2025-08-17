import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updateIncome } from '@/src/api';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  refreshData: () => void;
}

export default function IncomeModal({ isOpen, onClose, year, month, refreshData }: IncomeModalProps) {
  const [salary, setSalary] = useState('');
  const [extraPay, setExtraPay] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handleSubmit = async () => {
    if (!salary && !extraPay) {
      Alert.alert('Error', 'Por favor ingresa al menos un valor');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateIncome({
        year,
        month,
        salary: salary || undefined,
        extraPay: extraPay ? parseFloat(extraPay) : undefined,
      });
      
      Alert.alert('Éxito', 'Ingresos actualizados correctamente');
      refreshData();
      onClose();
      setSalary('');
      setExtraPay('');
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Error al actualizar ingresos');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setSalary('');
    setExtraPay('');
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Actualizar Ingresos</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            {monthNames[month - 1]} {year}
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Salario Base (€)</Text>
              <TextInput
                style={styles.input}
                value={salary}
                onChangeText={setSalary}
                placeholder="0.00"
                keyboardType="numeric"
                editable={!isSubmitting}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pago Extra (€)</Text>
              <TextInput
                style={styles.input}
                value={extraPay}
                onChangeText={setExtraPay}
                placeholder="0.00"
                keyboardType="numeric"
                editable={!isSubmitting}
              />
            </View>
          </View>

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
                {isSubmitting ? 'Guardando...' : 'Guardar'}
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
    padding: 24,
    width: '90%',
    maxWidth: 400,
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
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 24,
  },
  form: {
    gap: 20,
    marginBottom: 32,
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
  actions: {
    flexDirection: 'row',
    gap: 12,
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
