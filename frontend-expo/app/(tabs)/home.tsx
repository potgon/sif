import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Select from "@/src/components/ui/form/Select";

const months = [
  { label: "Enero", value: "1" },
  { label: "Febrero", value: "2" },
  { label: "Marzo", value: "3" },
  { label: "Abril", value: "4" },
  { label: "Mayo", value: "5" },
  { label: "Junio", value: "6" },
  { label: "Julio", value: "7" },
  { label: "Agosto", value: "8" },
  { label: "Septiembre", value: "9" },
  { label: "Octubre", value: "10" },
  { label: "Noviembre", value: "11" },
  { label: "Diciembre", value: "12" },
];

const years = Array.from({ length: 5 }, (_, i) => ({
  label: String(new Date().getFullYear() - i),
  value: String(new Date().getFullYear() - i),
}));

export default function Home() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    String(now.getMonth() + 1),
  );
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Control</Text>

        <View style={styles.selectors}>
          <View style={styles.selector}>
            <Select
              options={years}
              value={selectedYear}
              onChange={setSelectedYear}
              placeholder="Seleccionar año"
            />
          </View>

          <View style={styles.selector}>
            <Select
              options={months}
              value={selectedMonth}
              onChange={setSelectedMonth}
              placeholder="Seleccionar mes"
            />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Métricas Financieras</Text>
          <Text style={styles.cardContent}>
            Año: {selectedYear}, Mes:{" "}
            {months.find((m) => m.value === selectedMonth)?.label}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gráfico Anual de Gastos</Text>
          <Text style={styles.cardContent}>Datos del año {selectedYear}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Objetivo Mensual</Text>
          <Text style={styles.cardContent}>
            Meta para {months.find((m) => m.value === selectedMonth)?.label}{" "}
            {selectedYear}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transacciones Recientes</Text>
          <Text style={styles.cardContent}>
            Últimas transacciones del período seleccionado
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  selectors: {
    flexDirection: "row",
    gap: 12,
  },
  selector: {
    minWidth: 120,
  },
  content: {
    gap: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    color: "#6B7280",
  },
});