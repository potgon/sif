import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    try {
      // Check if user has a valid token
      const token = await AsyncStorage.getItem("token");
      
      if (token) {
        // Token exists, redirect to main app
        setIsAuthenticated(true);
        router.replace("/(tabs)/home");
      } else {
        // No token, redirect to sign-in
        setIsAuthenticated(false);
        router.replace("/sign-in");
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
      // On error, redirect to sign-in as fallback
      router.replace("/sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContent}>
          <Text style={styles.appTitle}>SIF</Text>
          <Text style={styles.appSubtitle}>Sistema de Información Financiera</Text>
          <ActivityIndicator size="large" color="#465FFF" style={styles.spinner} />
          <Text style={styles.loadingText}>Verificando autenticación...</Text>
        </View>
      </View>
    );
  }

  // This should never be reached due to redirects, but just in case
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.appTitle}>SIF</Text>
        <Text style={styles.appSubtitle}>Sistema de Información Financiera</Text>
        <Text style={styles.redirectText}>
          {isAuthenticated ? "Redirigiendo a la aplicación..." : "Redirigiendo al inicio de sesión..."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  appTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#465FFF",
    marginBottom: 8,
    textAlign: "center",
  },
  appSubtitle: {
    fontSize: 18,
    color: "#6B7280",
    marginBottom: 32,
    textAlign: "center",
  },
  spinner: {
    marginVertical: 24,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  redirectText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 16,
  },
});
