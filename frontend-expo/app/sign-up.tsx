import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import Input from "@/src/components/ui/form/input/InputField";
import Button from "@/src/components/ui/button/Buton";

export default function SignUp() {
  const handleSignUp = () => {
    // Navigate to home after sign up
    router.replace("/(tabs)/home");
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Únete a nosotros</Text>

        <View style={styles.form}>
          <Input
            label="Nombre"
            placeholder="Ingresa tu nombre"
            type="text"
          />
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

          <Button onPress={handleSignUp}>Crear Cuenta</Button>

          <TouchableOpacity onPress={handleSignIn} style={styles.linkButton}>
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
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