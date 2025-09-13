import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';
import { Asset, AssetValue, updateAssetValue } from '../../../api/investments';

interface UpdateAssetValueModalProps {
  visible: boolean;
  onClose: () => void;
  onValueUpdated: (asset: Asset) => void;
  asset: Asset | null;
}

const VALUE_SOURCES = [
  { value: 'MANUAL', label: 'Manual' },
  { value: 'API', label: 'API' },
  { value: 'CALCULATED', label: 'Calculado' },
];

export default function UpdateAssetValueModal({ 
  visible, 
  onClose, 
  onValueUpdated,
  asset 
}: UpdateAssetValueModalProps) {
  const { colors } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    currentValue: '',
    currentPrice: '',
    valueDate: new Date().toISOString().split('T')[0],
    source: 'MANUAL',
    notes: '',
  });

  useEffect(() => {
    if (visible && asset) {
      setFormData({
        currentValue: asset.currentValue?.toString() || '',
        currentPrice: asset.currentPrice?.toString() || '',
        valueDate: new Date().toISOString().split('T')[0],
        source: 'MANUAL',
        notes: '',
      });
      setSelectedDate(new Date());
    }
  }, [visible, asset]);

  const handleSubmit = async () => {
    if (!asset) return;

    if (!formData.currentValue) {
      Alert.alert('Error', 'El valor actual es obligatorio');
      return;
    }

    setLoading(true);
    try {
      await updateAssetValue(asset.id, {
        assetId: asset.id,
        currentValue: parseFloat(formData.currentValue),
        currentPrice: formData.currentPrice ? parseFloat(formData.currentPrice) : undefined,
        valueDate: formData.valueDate,
        source: formData.source,
        notes: formData.notes || undefined,
      });

      onValueUpdated(asset);
      onClose();
    } catch (error) {
      console.error('Error updating asset value:', error);
      Alert.alert('Error', 'No se pudo actualizar el valor del activo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setFormData(prev => ({ 
        ...prev, 
        valueDate: selectedDate.toISOString().split('T')[0] 
      }));
    }
  };

  const calculateProfitFromValue = () => {
    if (formData.currentValue && asset?.totalInvested) {
      const currentValue = parseFloat(formData.currentValue);
      const totalInvested = asset.totalInvested;
      const profit = currentValue - totalInvested;
      const profitability = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;
      
      return {
        profit: profit.toFixed(2),
        profitability: profitability.toFixed(2)
      };
    }
    return null;
  };

  const profitData = calculateProfitFromValue();

  if (!visible || !asset) return null;

  return (
    <View style={styles.overlay}>
      <View style={[styles.modal, { backgroundColor: colors.card }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Actualizar Valor</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.assetInfo}>
              <Text style={[styles.assetName, { color: colors.textPrimary }]}>{asset.name}</Text>
              <Text style={[styles.assetDetails, { color: colors.textMuted }]}>
                Total Invertido: {new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(asset.totalInvested)}
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Valor Actual *</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }
                ]}
                value={formData.currentValue}
                onChangeText={(text) => setFormData({ ...formData, currentValue: text })}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Precio por Acción</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }
                ]}
                value={formData.currentPrice}
                onChangeText={(text) => setFormData({ ...formData, currentPrice: text })}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Fecha del Valor *</Text>
              <TouchableOpacity 
                style={[
                  styles.dateInput,
                  { 
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  }
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.dateText, { color: colors.textPrimary }]}>
                  {formData.valueDate}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Fuente</Text>
              <View style={styles.radioGroup}>
                {VALUE_SOURCES.map((source) => (
                  <TouchableOpacity
                    key={source.value}
                    style={[
                      styles.radioOption,
                      {
                        backgroundColor: formData.source === source.value ? colors.buttonPrimary : colors.background,
                        borderColor: colors.border,
                      }
                    ]}
                    onPress={() => setFormData({ ...formData, source: source.value })}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        {
                          color: formData.source === source.value ? 'white' : colors.textPrimary,
                        }
                      ]}
                    >
                      {source.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Notas</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { 
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }
                ]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Notas sobre este valor..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
              />
            </View>

            {profitData && (
              <View style={[styles.profitPreview, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <Text style={[styles.previewTitle, { color: colors.textPrimary }]}>Vista Previa</Text>
                <View style={styles.previewRow}>
                  <Text style={[styles.previewLabel, { color: colors.textMuted }]}>Beneficio/Pérdida:</Text>
                  <Text style={[
                    styles.previewValue, 
                    { color: parseFloat(profitData.profit) >= 0 ? colors.success : colors.error }
                  ]}>
                    {new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(parseFloat(profitData.profit))}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={[styles.previewLabel, { color: colors.textMuted }]}>Rentabilidad:</Text>
                  <Text style={[
                    styles.previewValue, 
                    { color: parseFloat(profitData.profitability) >= 0 ? colors.success : colors.error }
                  ]}>
                    {parseFloat(profitData.profitability) >= 0 ? '+' : ''}{profitData.profitability}%
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.border }]}
            onPress={onClose}
          >
            <Text style={[styles.cancelText, { color: colors.textPrimary }]}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.buttonPrimary }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? 'Actualizando...' : 'Actualizar Valor'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flexGrow: 1,
  },
  form: {
    padding: 20,
  },
  assetInfo: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  assetName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  assetDetails: {
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    flex: 1,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radioOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  radioText: {
    fontSize: 14,
    fontWeight: '500',
  },
  profitPreview: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 14,
  },
  previewValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
