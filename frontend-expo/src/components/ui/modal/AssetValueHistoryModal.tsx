import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';
import { Asset, AssetValue, getAssetValueHistory } from '../../../api/investments';

interface AssetValueHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  asset: Asset | null;
}

export default function AssetValueHistoryModal({ 
  visible, 
  onClose, 
  asset 
}: AssetValueHistoryModalProps) {
  const { colors } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<AssetValue[]>([]);

  useEffect(() => {
    if (visible && asset) {
      loadHistory();
    }
  }, [visible, asset]);

  const loadHistory = async () => {
    if (!asset) return;

    setLoading(true);
    try {
      const historyData = await getAssetValueHistory(asset.id);
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading value history:', error);
      Alert.alert('Error', 'No se pudo cargar el historial de valores.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'MANUAL':
        return 'create-outline';
      case 'API':
        return 'cloud-outline';
      case 'CALCULATED':
        return 'calculator-outline';
      default:
        return 'information-circle-outline';
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'MANUAL':
        return 'Manual';
      case 'API':
        return 'API';
      case 'CALCULATED':
        return 'Calculado';
      default:
        return source;
    }
  };

  const renderHistoryItem = ({ item }: { item: AssetValue }) => {
    const profit = item.currentValue - asset!.totalInvested;
    const profitability = asset!.totalInvested > 0 ? (profit / asset!.totalInvested) * 100 : 0;

    return (
      <View style={[styles.historyItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <View style={styles.historyHeader}>
          <View style={styles.historyInfo}>
            <Text style={[styles.historyDate, { color: colors.textPrimary }]}>
              {formatDate(item.valueDate)}
            </Text>
            <View style={styles.sourceContainer}>
              <Ionicons 
                name={getSourceIcon(item.source) as any} 
                size={14} 
                color={colors.textMuted} 
              />
              <Text style={[styles.sourceText, { color: colors.textMuted }]}>
                {getSourceLabel(item.source)}
              </Text>
            </View>
          </View>
          <View style={styles.historyValues}>
            <Text style={[styles.currentValue, { color: colors.textPrimary }]}>
              {formatCurrency(item.currentValue)}
            </Text>
            {item.currentPrice && (
              <Text style={[styles.currentPrice, { color: colors.textMuted }]}>
                {formatCurrency(item.currentPrice)}/acción
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.historyMetrics}>
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Beneficio/Pérdida</Text>
            <Text style={[
              styles.metricValue, 
              { color: profit >= 0 ? colors.success : colors.error }
            ]}>
              {formatCurrency(profit)}
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Rentabilidad</Text>
            <Text style={[
              styles.metricValue, 
              { color: profitability >= 0 ? colors.success : colors.error }
            ]}>
              {profitability >= 0 ? '+' : ''}{profitability.toFixed(2)}%
            </Text>
          </View>
        </View>

        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={[styles.notesLabel, { color: colors.textMuted }]}>Notas:</Text>
            <Text style={[styles.notesText, { color: colors.textPrimary }]}>{item.notes}</Text>
          </View>
        )}
      </View>
    );
  };

  if (!visible || !asset) return null;

  return (
    <View style={styles.overlay}>
      <View style={[styles.modal, { backgroundColor: colors.card }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Historial de Valores</Text>
            <Text style={[styles.assetName, { color: colors.textMuted }]}>{asset.name}</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: colors.textPrimary }]}>Cargando historial...</Text>
            </View>
          ) : history.length > 0 ? (
            <FlatList
              data={history}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="time-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                No hay historial de valores
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                Actualiza el valor del activo para ver el historial aquí
              </Text>
            </View>
          )}
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
    width: '95%',
    maxWidth: 500,
    maxHeight: '85%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  assetName: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  historyItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sourceText: {
    fontSize: 12,
  },
  historyValues: {
    alignItems: 'flex-end',
  },
  currentValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  currentPrice: {
    fontSize: 12,
  },
  historyMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
