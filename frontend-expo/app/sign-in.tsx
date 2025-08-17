import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert as RNAlert } from "react-native";
import { router } from "expo-router";
import Input from "@/src/components/ui/form/input/InputField";
import Button from "@/src/components/ui/button/Buton";
import Alert from "@/src/components/ui/alert/Alert";
import { login } from "@/src/api/auth";
import { useAuth } from "@/src/hooks/useAuth";

export default function SignIn() {
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const handleSignIn = async () => {
    if (!email || !password) {
      setAlert({
        variant: "error",
        title: "Error",
        message: "Por favor completa todos los campos",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await login({ email, password });
      
      // Use the auth hook to handle login
      await authLogin(response.token);
      
      setAlert({
        variant: "success",
        title: "Éxito",
        message: "Sesión iniciada correctamente",
      });

      // The hook will handle navigation automatically
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error al iniciar sesión";
      setAlert({
        variant: "error",
        title: "Error",
        message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.subtitle}>Bienvenido de vuelta</Text>

        {alert && (
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Ingresa tu email"
            type="email"
            value={email}
            onChange={(value) => setEmail(value as string)}
          />
          <Input
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            type="password"
            value={password}
            onChange={(value) => setPassword(value as string)}
          />

          <Button onPress={handleSignIn} disabled={isLoading}>
            {isLoading ? "Iniciando..." : "Iniciar Sesión"}
          </Button>

          <TouchableOpacity onPress={handleSignUp} style={styles.linkButton}>
            <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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