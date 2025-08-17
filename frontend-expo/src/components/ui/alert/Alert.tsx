import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AlertProps {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ variant, title, message, onClose }) => {
  const variantStyles = {
    success: {
      container: { borderColor: "#22c55e", backgroundColor: "#f0fdf4" },
      icon: "#22c55e",
    },
    error: {
      container: { borderColor: "#ef4444", backgroundColor: "#fef2f2" },
      icon: "#ef4444",
    },
    warning: {
      container: { borderColor: "#f59e0b", backgroundColor: "#fffbeb" },
      icon: "#f59e0b",
    },
    info: {
      container: { borderColor: "#3b82f6", backgroundColor: "#eff6ff" },
      icon: "#3b82f6",
    },
  };

  const icons = {
    success: "checkmark-circle" as const,
    error: "close-circle" as const,
    warning: "warning" as const,
    info: "information-circle" as const,
  };

  const currentStyle = variantStyles[variant];
  const currentIcon = icons[variant];

  return (
    <View style={[styles.container, currentStyle.container]}>
      <View style={styles.content}>
        <Ionicons name={currentIcon} size={24} color={currentStyle.icon} />
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>

        {onClose && (
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={20} color="#6b7280" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#6b7280",
  },
  closeButton: {
    padding: 4,
  },
});

export default Alert;
