import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../../theme/useAppTheme";

interface AlertProps {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ variant, title, message, onClose }) => {
  const { colors } = useAppTheme();

  const variantStyles = {
    success: {
      container: { 
        borderColor: colors.success, 
        backgroundColor: colors.successLight 
      },
      icon: colors.success,
    },
    error: {
      container: { 
        borderColor: colors.error, 
        backgroundColor: colors.errorLight 
      },
      icon: colors.error,
    },
    warning: {
      container: { 
        borderColor: colors.warning, 
        backgroundColor: colors.warningLight 
      },
      icon: colors.warning,
    },
    info: {
      container: { 
        borderColor: colors.info, 
        backgroundColor: colors.infoLight 
      },
      icon: colors.info,
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
          <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
        </View>

        {onClose && (
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={20} color={colors.textMuted} />
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
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
  },
  closeButton: {
    padding: 4,
  },
});

export default Alert;
