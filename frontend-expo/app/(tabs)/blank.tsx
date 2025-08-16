import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Blank() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Card Title Here</Text>
        <Text style={styles.content}>
          Start putting content on grids or panels, you can also use different
          combinations of grids. Please check out the dashboard and other pages
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 40,
    maxWidth: 630,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  content: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});