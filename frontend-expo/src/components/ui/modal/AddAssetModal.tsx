import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';
import { createAsset, Asset } from '../../../api/investments';

interface AddAssetModalProps {
  visible: boolean;
  onClose: () => void;
  onAssetAdded: (asset: Asset) => void;
}

const ASSET_TYPES = [
  { value: 'INDEX_FUND', label: 'Fondo Indexado' },
  { value: 'ETC', label: 'ETC' },
  { value: 'CRYPTO', label: 'Criptomoneda' },
  { value: 'STOCK', label: 'Acción' },
  { value: 'BOND', label: 'Bono' },
  { value: 'ETF', label: 'ETF' },
  { value: 'OTHER', label: 'Otro' },
];

const CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF'];

export default function AddAssetModal({ visible, onClose, onAssetAdded }: AddAssetModalProps) {
  const { colors } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    isin: '',
    symbol: '',
    assetType: 'INDEX_FUND' as Asset['assetType'],
    currency: 'EUR',
  });

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre del activo es obligatorio');
      return;
    }

    setLoading(true);
    try {
      const asset = await createAsset(formData);
      onAssetAdded(asset);
      setFormData({
        name: '',
        isin: '',
        symbol: '',
        assetType: 'INDEX_FUND',
        currency: 'EUR',
      });
      onClose();
    } catch (error) {
      console.error('Error creating asset:', error);
      Alert.alert('Error', 'No se pudo crear el activo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={[styles.modal, { backgroundColor: colors.card }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Agregar Activo</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Nombre del Activo *</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }
                ]}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Ej: Vanguard S&P 500"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>ISIN</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }
                ]}
                value={formData.isin}
                onChangeText={(text) => setFormData({ ...formData, isin: text })}
                placeholder="Ej: IE00B3XXRP09"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Símbolo</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    color: colors.textPrimary,
                  }
                ]}
                value={formData.symbol}
                onChangeText={(text) => setFormData({ ...formData, symbol: text })}
                placeholder="Ej: VUSA"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Tipo de Activo *</Text>
              <View style={styles.radioGroup}>
                {ASSET_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.radioOption,
                      {
                        backgroundColor: formData.assetType === type.value ? colors.buttonPrimary : colors.background,
                        borderColor: colors.border,
                      }
                    ]}
                    onPress={() => setFormData({ ...formData, assetType: type.value as Asset['assetType'] })}
                  >
                    <Text
                      style={[
                        styles.radioText,
                        {
                          color: formData.assetType === type.value ? 'white' : colors.textPrimary,
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
              <Text style={[styles.label, { color: colors.textPrimary }]}>Moneda *</Text>
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
              {loading ? 'Creando...' : 'Crear Activo'}
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
    marginBottom: 20,
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
