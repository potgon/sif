import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { updateIncome } from '../../../api';
import { useAppTheme } from '../../../theme/useAppTheme';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  month: number;
  refreshData: () => void;
}

export default function IncomeModal({ isOpen, onClose, year, month, refreshData }: IncomeModalProps) {
  const { colors } = useAppTheme();
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
        salary: salary ? parseFloat(salary) : undefined,
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

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.modalOverlay }]}>
        <View style={[styles.modal, { 
          backgroundColor: colors.modalBackground,
          borderColor: colors.modalBorder 
        }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Actualizar Ingresos
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {monthNames[month - 1]} {year}
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Salario Base (€)
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.inputText 
                }]}
                value={salary}
                onChangeText={setSalary}
                placeholder="0.00"
                placeholderTextColor={colors.inputPlaceholder}
                keyboardType="numeric"
                editable={!isSubmitting}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>
                Pago Extra (€)
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.inputText 
                }]}
                value={extraPay}
                onChangeText={setExtraPay}
                placeholder="0.00"
                placeholderTextColor={colors.inputPlaceholder}
                keyboardType="numeric"
                editable={!isSubmitting}
              />
            </View>
          </View>

          <View style={[styles.actions, { borderTopColor: colors.border }]}>
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
    borderRadius: 20,
    width: '100%',
    maxWidth: Platform.OS === 'ios' ? 400 : 450,
    maxHeight: Platform.OS === 'ios' ? '80%' : '75%',
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
    padding: Platform.OS === 'ios' ? 28 : 32,
    paddingBottom: Platform.OS === 'ios' ? 24 : 28,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 36,
    textAlign: 'center',
    paddingTop: 24,
  },
  form: {
    gap: 32,
    paddingHorizontal: Platform.OS === 'ios' ? 28 : 32,
    flex: 1,
  },
  inputGroup: {
    gap: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    padding: Platform.OS === 'ios' ? 20 : 22,
    fontSize: 18,
    borderWidth: 1,
    minHeight: 60,
  },
  actions: {
    flexDirection: 'row',
    gap: 20,
    padding: Platform.OS === 'ios' ? 28 : 32,
    paddingTop: Platform.OS === 'ios' ? 24 : 28,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 20 : 22,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  submitButton: {
    // Background color is handled dynamically
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
