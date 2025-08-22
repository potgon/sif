import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';

interface AccumulatedParamModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentValue: number;
  monthExpenseTarget: number;
  onUpdate: (newValue: number) => void;
  onRenew: () => void;
}

export default function AccumulatedParamModal({ 
  isOpen, 
  onClose, 
  currentValue, 
  monthExpenseTarget,
  onUpdate, 
  onRenew 
}: AccumulatedParamModalProps) {
  const { colors } = useAppTheme();
  const [accumulatedValue, setAccumulatedValue] = useState(String(currentValue));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    setAccumulatedValue(String(currentValue));
    setHasChanged(false);
  }, [currentValue, isOpen]);

  const handleValueChange = (value: string) => {
    setAccumulatedValue(value);
    setHasChanged(parseFloat(value) !== currentValue);
  };

  const handleEdit = async () => {
    if (!hasChanged) {
      Alert.alert('Sin cambios', 'No se han realizado cambios en el valor');
      return;
    }

    const newValue = parseFloat(accumulatedValue);
    if (isNaN(newValue)) {
      Alert.alert('Error', 'Por favor ingresa un valor numérico válido');
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(newValue);
      Alert.alert('Éxito', 'Valor acumulado actualizado correctamente');
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Error al actualizar el valor acumulado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRenew = async () => {
    const newValue = currentValue + monthExpenseTarget;
    setIsSubmitting(true);
    try {
      await onUpdate(newValue);
      Alert.alert('Éxito', 'Valor acumulado renovado correctamente');
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Error al renovar el valor acumulado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setAccumulatedValue(String(currentValue));
    setHasChanged(false);
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
              Editar Valor Acumulado
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.infoSection}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Valor Actual
              </Text>
              <Text style={[styles.currentValue, { color: colors.textPrimary }]}>
                €{currentValue.toFixed(2)}
              </Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Meta de Gastos del Mes
              </Text>
              <Text style={[styles.targetValue, { color: colors.textPrimary }]}>
                €{monthExpenseTarget.toFixed(2)}
              </Text>
            </View>

            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                Nuevo Valor Acumulado (€)
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.inputText 
                }]}
                value={accumulatedValue}
                onChangeText={handleValueChange}
                placeholder="0.00"
                placeholderTextColor={colors.inputPlaceholder}
                keyboardType="numeric"
                editable={!isSubmitting}
              />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.renewButton, { 
                  backgroundColor: colors.warning 
                }]}
                onPress={handleRenew}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, { color: colors.buttonPrimaryText }]}>
                  Renovar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.editButton, { 
                  backgroundColor: colors.buttonPrimary 
                }]}
                onPress={handleEdit}
                disabled={isSubmitting || !hasChanged}
                activeOpacity={0.7}
              >
                <Text style={[styles.buttonText, { color: colors.buttonPrimaryText }]}>
                  {isSubmitting ? 'Actualizando...' : 'Editar'}
                </Text>
              </TouchableOpacity>
            </View>
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
  content: {
    flex: 1,
    padding: Platform.OS === 'ios' ? 28 : 32,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  currentValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  targetValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  inputSection: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
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
    gap: 16,
    marginTop: 'auto',
  },
  button: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 20 : 22,
    borderRadius: 12,
    alignItems: 'center',
  },
  renewButton: {
    // Background color is handled dynamically
  },
  editButton: {
    // Background color is handled dynamically
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
