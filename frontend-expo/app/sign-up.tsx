import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import Input from "@/src/components/ui/form/input/InputField";
import Button from "@/src/components/ui/button/Buton";
import Alert from "@/src/components/ui/alert/Alert";
import { register } from "@/src/api/auth";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    variant: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const handleSignUp = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setAlert({
        variant: "error",
        title: "Error",
        message: "Por favor completa todos los campos obligatorios",
      });
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        surname: formData.surname,
      };

      const response = await register(requestData);
      
      setAlert({
        variant: "success",
        title: "Registro exitoso",
        message: "Cuenta creada correctamente",
      });

      // Navigate to sign-in after a short delay
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Error al crear la cuenta";
      setAlert({
        variant: "error",
        title: "Error de registro",
        message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Únete a nosotros</Text>

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
            label="Nombre"
            placeholder="Ingresa tu nombre"
            type="text"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value as string })}
          />
          <Input
            label="Apellidos"
            placeholder="Ingresa tus apellidos"
            type="text"
            value={formData.surname}
            onChange={(value) => setFormData({ ...formData, surname: value as string })}
          />
          <Input
            label="Email"
            placeholder="Ingresa tu email"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value as string })}
          />
          <Input
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            type="password"
            value={formData.password}
            onChange={(value) => setFormData({ ...formData, password: value as string })}
          />

          <Button onPress={handleSignUp} disabled={isLoading}>
            {isLoading ? "Creando..." : "Crear Cuenta"}
          </Button>

          <TouchableOpacity onPress={handleSignIn} style={styles.linkButton}>
            <Text style={styles.linkText}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
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