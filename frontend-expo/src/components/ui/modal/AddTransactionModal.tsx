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
import { createInvestment, getAssets, Asset, Investment } from '../../../api/investments';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onTransactionAdded: (transaction: Investment) => void;
  preselectedAssetId?: number;
}

const TRANSACTION_TYPES = [
  { value: 'BUY', label: 'Compra' },
  { value: 'SELL', label: 'Venta' },
  { value: 'DIVIDEND', label: 'Dividendo' },
  { value: 'SPLIT', label: 'Split' },
];

const CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF'];

export default function AddTransactionModal({ 
  visible, 
  onClose, 
  onTransactionAdded,
  preselectedAssetId 
}: AddTransactionModalProps) {
  const { colors } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showAssetDropdown, setShowAssetDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    assetId: preselectedAssetId || 0,
    transactionType: 'BUY' as Investment['transactionType'],
    transactionDate: new Date().toISOString().split('T')[0],
    amountInvested: '',
    sharesQuantity: '',
    pricePerShare: '',
    currency: 'EUR',
    exchangeRate: '',
    fees: '',
    notes: '',
  });

  useEffect(() => {
    if (visible) {
      loadAssets();
      if (preselectedAssetId) {
        setFormData(prev => ({ ...prev, assetId: preselectedAssetId }));
      }
    }
  }, [visible, preselectedAssetId]);

  const loadAssets = async () => {
    try {
      const assetsData = await getAssets();
      setAssets(assetsData);
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.assetId) {
      Alert.alert('Error', 'Selecciona un activo');
      return;
    }

    if (!formData.amountInvested) {
      Alert.alert('Error', 'El monto invertido es obligatorio');
      return;
    }

    setLoading(true);
    try {
      const transaction = await createInvestment({
        assetId: formData.assetId,
        transactionType: formData.transactionType,
        transactionDate: formData.transactionDate,
        amountInvested: parseFloat(formData.amountInvested),
        sharesQuantity: formData.sharesQuantity ? parseFloat(formData.sharesQuantity) : undefined,
        pricePerShare: formData.pricePerShare ? parseFloat(formData.pricePerShare) : undefined,
        currency: formData.currency,
        exchangeRate: formData.exchangeRate ? parseFloat(formData.exchangeRate) : undefined,
        fees: formData.fees ? parseFloat(formData.fees) : undefined,
        notes: formData.notes || undefined,
      });

      onTransactionAdded(transaction);
      setFormData({
        assetId: preselectedAssetId || 0,
        transactionType: 'BUY',
        transactionDate: new Date().toISOString().split('T')[0],
        amountInvested: '',
        sharesQuantity: '',
        pricePerShare: '',
        currency: 'EUR',
        exchangeRate: '',
        fees: '',
        notes: '',
      });
      onClose();
    } catch (error) {
      console.error('Error creating transaction:', error);
      Alert.alert('Error', 'No se pudo crear la transacción. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const calculateSharesFromAmount = () => {
    if (formData.amountInvested && formData.pricePerShare) {
      const amount = parseFloat(formData.amountInvested);
      const price = parseFloat(formData.pricePerShare);
      if (price > 0) {
        const shares = amount / price;
        setFormData(prev => ({ ...prev, sharesQuantity: shares.toFixed(6) }));
      }
    }
  };

  const calculateAmountFromShares = () => {
    if (formData.sharesQuantity && formData.pricePerShare) {
      const shares = parseFloat(formData.sharesQuantity);
      const price = parseFloat(formData.pricePerShare);
      const amount = shares * price;
      setFormData(prev => ({ ...prev, amountInvested: amount.toFixed(2) }));
    }
  };

  const calculatePriceFromAmountAndShares = () => {
    if (formData.amountInvested && formData.sharesQuantity) {
      const amount = parseFloat(formData.amountInvested);
      const shares = parseFloat(formData.sharesQuantity);
      if (shares > 0) {
        const price = amount / shares;
        setFormData(prev => ({ ...prev, pricePerShare: price.toFixed(4) }));
      }
    }
  };

  const handleAmountChange = (value: string) => {
    setFormData(prev => ({ ...prev, amountInvested: value }));
    // Auto-calculate shares if price is set
    if (value && formData.pricePerShare) {
      const amount = parseFloat(value);
      const price = parseFloat(formData.pricePerShare);
      if (price > 0) {
        const shares = amount / price;
        setFormData(prev => ({ ...prev, amountInvested: value, sharesQuantity: shares.toFixed(6) }));
      }
    }
  };

  const handlePriceChange = (value: string) => {
    setFormData(prev => ({ ...prev, pricePerShare: value }));
    // Auto-calculate shares if amount is set
    if (value && formData.amountInvested) {
      const amount = parseFloat(formData.amountInvested);
      const price = parseFloat(value);
      if (price > 0) {
        const shares = amount / price;
        setFormData(prev => ({ ...prev, pricePerShare: value, sharesQuantity: shares.toFixed(6) }));
      }
    }
  };

  const handleSharesChange = (value: string) => {
    setFormData(prev => ({ ...prev, sharesQuantity: value }));
    
    // Auto-calculate amount if price is set
    if (value && formData.pricePerShare) {
      const shares = parseFloat(value);
      const price = parseFloat(formData.pricePerShare);
      const amount = shares * price;
      setFormData(prev => ({ ...prev, sharesQuantity: value, amountInvested: amount.toFixed(2) }));
    }
    // Auto-calculate price if amount is set
    else if (value && formData.amountInvested) {
      const shares = parseFloat(value);
      const amount = parseFloat(formData.amountInvested);
      if (shares > 0) {
        const price = amount / shares;
        setFormData(prev => ({ ...prev, sharesQuantity: value, pricePerShare: price.toFixed(4) }));
      }
    }
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      setFormData(prev => ({ 
        ...prev, 
        transactionDate: selectedDate.toISOString().split('T')[0] 
      }));
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={[styles.modal, { backgroundColor: colors.card }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Nueva Transacción</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Activo *</Text>
              <TouchableOpacity 
                style={[styles.dropdown, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={() => setShowAssetDropdown(!showAssetDropdown)}
              >
                <Text style={[styles.dropdownText, { color: colors.textPrimary }]}>
                  {assets.find(a => a.id === formData.assetId)?.name || 'Seleccionar activo'}
                </Text>
                <Ionicons 
                  name={showAssetDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={colors.textMuted} 
                />
              </TouchableOpacity>
              {showAssetDropdown && (
                <ScrollView style={[styles.optionsList, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  {assets.map((asset) => (
                    <TouchableOpacity
                      key={asset.id}
                      style={[
                        styles.option,
                        { backgroundColor: formData.assetId === asset.id ? colors.buttonPrimary : 'transparent' }
                      ]}
                      onPress={() => {
                        setFormData({ ...formData, assetId: asset.id, currency: asset.currency });
                        setShowAssetDropdown(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          { color: formData.assetId === asset.id ? 'white' : colors.textPrimary }
                        ]}
                      >
                        {asset.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Tipo de Transacción *</Text>
              <View style={styles.radioGroup}>
                {TRANSACTION_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.radioOption,
                      {
                        backgroundColor: formData.transactionType === type.value ? colors.buttonPrimary : colors.background,
                        borderColor: colors.border,
                      }
                    ]}
                    onPress={() => setFormData({ ...formData, transactionType: type.value as Investment['transactionType'] })}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        {
                          color: formData.transactionType === type.value ? 'white' : colors.textPrimary,
                        }
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Fecha *</Text>
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
                  {formData.transactionDate}
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

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Monto *</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }
                  ]}
                  value={formData.amountInvested}
                  onChangeText={handleAmountChange}
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
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
                  value={formData.pricePerShare}
                  onChangeText={handlePriceChange}
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Cantidad de Acciones</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }
                  ]}
                  value={formData.sharesQuantity}
                  onChangeText={handleSharesChange}
                  placeholder="0.000000"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, { color: colors.textPrimary }]}>Comisiones</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    }
                  ]}
                  value={formData.fees}
                  onChangeText={(text) => setFormData({ ...formData, fees: text })}
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Moneda</Text>
              <View style={styles.radioGroup}>
                {CURRENCIES.map((currency) => (
                  <TouchableOpacity
                    key={currency}
                    style={[
                      styles.radioOption,
                      {
                        backgroundColor: formData.currency === currency ? colors.buttonPrimary : colors.background,
                        borderColor: colors.border,
                      }
                    ]}
                    onPress={() => setFormData({ ...formData, currency })}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        {
                          color: formData.currency === currency ? 'white' : colors.textPrimary,
                        }
                      ]}
                    >
                      {currency}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Tipo de Cambio</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }
                ]}
                value={formData.exchangeRate}
                onChangeText={(text) => setFormData({ ...formData, exchangeRate: text })}
                placeholder="1.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
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
                placeholder="Notas adicionales..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
              />
            </View>
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
              {loading ? 'Creando...' : 'Crear Transacción'}
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
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
  },
  optionsList: {
    maxHeight: 150,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  optionText: {
    fontSize: 16,
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