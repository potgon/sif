import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../src/theme/useAppTheme";
import { Asset, InvestmentSummary, Investment, getInvestmentSummary } from "../../src/api/investments";
import AddAssetModal from "../../src/components/ui/modal/AddAssetModal";
import AddInvestmentModal from "../../src/components/ui/modal/AddInvestmentModal";
import UpdateAssetValueModal from "../../src/components/ui/modal/UpdateAssetValueModal";
import AssetValueHistoryModal from "../../src/components/ui/modal/AssetValueHistoryModal";

export default function InvestmentsScreen() {
  const { colors } = useAppTheme();
  const [summary, setSummary] = useState<InvestmentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showAddInvestmentModal, setShowAddInvestmentModal] = useState(false);
  const [showUpdateValueModal, setShowUpdateValueModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const loadSummary = async () => {
    try {
      const data = await getInvestmentSummary();
      setSummary(data);
    } catch (error) {
      console.error("Error loading investment summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSummary();
    setRefreshing(false);
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };

  const handleAssetAdded = (asset: Asset) => {
    loadSummary(); // Reload the summary to include the new asset
  };

  const handleInvestmentAdded = (investment: Investment) => {
    loadSummary(); // Reload the summary to include the new investment
  };

  const handleUpdateValue = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowUpdateValueModal(true);
  };

  const handleShowHistory = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowHistoryModal(true);
  };

  const handleValueUpdated = (asset: Asset) => {
    loadSummary(); // Reload the summary to include the updated value
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textPrimary }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Inversiones</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.buttonPrimary }]}
          onPress={() => setShowAddAssetModal(true)}
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Total Invertido</Text>
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
            {summary ? formatCurrency(summary.totalInvested) : formatCurrency(0)}
          </Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Valor Actual</Text>
          <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>
            {summary ? formatCurrency(summary.totalCurrentValue) : formatCurrency(0)}
          </Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Beneficio Neto</Text>
          <Text style={[
            styles.summaryValue, 
            { color: summary && summary.totalNetProfit >= 0 ? colors.success : colors.error }
          ]}>
            {summary ? formatCurrency(summary.totalNetProfit) : formatCurrency(0)}
          </Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Rentabilidad</Text>
          <Text style={[
            styles.summaryValue, 
            { color: summary && summary.totalProfitability >= 0 ? colors.success : colors.error }
          ]}>
            {summary ? formatPercentage(summary.totalProfitability) : formatPercentage(0)}
          </Text>
        </View>
      </View>

      {/* Assets List */}
      <View style={styles.assetsSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Mis Activos</Text>
          <TouchableOpacity 
            onPress={() => setShowAddInvestmentModal(true)}
            style={styles.addTransactionButton}
          >
            <Ionicons name="swap-horizontal" size={16} color={colors.buttonPrimary} />
            <Text style={[styles.addTransactionText, { color: colors.buttonPrimary }]}>Nueva Transacción</Text>
          </TouchableOpacity>
        </View>

        {summary?.assets && summary.assets.length > 0 ? (
          summary.assets.map((asset) => (
            <View key={asset.id} style={[styles.assetCard, { backgroundColor: colors.card }]}>
              <View style={styles.assetHeader}>
                <View style={styles.assetInfo}>
                  <Text style={[styles.assetName, { color: colors.textPrimary }]}>{asset.name}</Text>
                  <Text style={[styles.assetType, { color: colors.textMuted }]}>
                    {asset.assetType.replace('_', ' ')}
                  </Text>
                  {asset.lastValueDate && (
                    <Text style={[styles.lastUpdate, { color: colors.textMuted }]}>
                      Última actualización: {new Date(asset.lastValueDate).toLocaleDateString('es-ES')}
                    </Text>
                  )}
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.updateButton, { backgroundColor: colors.buttonPrimary }]}
                    onPress={() => handleUpdateValue(asset)}
                  >
                    <Ionicons name="refresh" size={16} color="white" />
                    <Text style={styles.updateButtonText}>Actualizar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.historyButton, { borderColor: colors.border }]}
                    onPress={() => handleShowHistory(asset)}
                  >
                    <Ionicons name="time-outline" size={16} color={colors.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.assetMetrics}>
                <View style={styles.metric}>
                  <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Invertido</Text>
                  <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
                    {formatCurrency(asset.totalInvested)}
                  </Text>
                </View>
                <View style={styles.metric}>
                  <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Valor</Text>
                  <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
                    {formatCurrency(asset.currentValue)}
                  </Text>
                </View>
                <View style={styles.metric}>
                  <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Rentabilidad</Text>
                  <Text style={[
                    styles.metricValue, 
                    { color: asset.profitability >= 0 ? colors.success : colors.error }
                  ]}>
                    {formatPercentage(asset.profitability)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
            <Ionicons name="trending-up-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No tienes activos aún</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              Comienza agregando tu primer activo para empezar a hacer seguimiento de tus inversiones
            </Text>
            <TouchableOpacity 
              style={[styles.emptyButton, { backgroundColor: colors.buttonPrimary }]}
              onPress={() => setShowAddAssetModal(true)}
            >
              <Text style={styles.emptyButtonText}>Agregar Primer Activo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modals */}
      <AddAssetModal
        visible={showAddAssetModal}
        onClose={() => setShowAddAssetModal(false)}
        onAssetAdded={handleAssetAdded}
      />
      
      <AddInvestmentModal
        visible={showAddInvestmentModal}
        onClose={() => setShowAddInvestmentModal(false)}
        onTransactionAdded={handleInvestmentAdded}
      />

      <UpdateAssetValueModal
        visible={showUpdateValueModal}
        onClose={() => setShowUpdateValueModal(false)}
        onValueUpdated={handleValueUpdated}
        asset={selectedAsset}
      />

      <AssetValueHistoryModal
        visible={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        asset={selectedAsset}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 100,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  assetsSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  addTransactionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addTransactionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  assetCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  assetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  assetInfo: {
    flex: 1,
  },
  assetName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  assetType: {
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  lastUpdate: {
    fontSize: 10,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  updateButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  historyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  assetMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metric: {
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    borderRadius: 12,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
