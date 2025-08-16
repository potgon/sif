import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import Input from "@/src/components/ui/form/input/InputField";
import Button from "@/src/components/ui/button/Buton";

export default function SignIn() {
  const handleSignIn = () => {
    // Navigate to home after sign in
    router.replace("/(tabs)/home");
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}>Bienvenido de vuelta</Text>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Ingresa tu email"
            type="email"
          />
          <Input
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            type="password"
          />

          <Button onPress={handleSignIn}>Iniciar Sesión</Button>

          <TouchableOpacity onPress={handleSignUp} style={styles.linkButton}>
            <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
        </View>
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
    padding: 16,
  },
  content: {
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  linkButton: {
    marginTop: 16,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: "#465FFF",
    fontWeight: "500",
  },
});