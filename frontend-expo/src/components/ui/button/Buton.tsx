import React, { ReactNode } from "react";
import {
  Text,
  Pressable,
  View,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useAppTheme } from "../../../theme/useAppTheme";

interface ButtonProps {
  children: ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "outline";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onPress,
  disabled = false,
  style,
}) => {
  const { colors } = useAppTheme();

  // size styles
  const sizeStyles: Record<"sm" | "md", { paddingVertical: number; paddingHorizontal: number; textStyle: TextStyle }> = {
    sm: { paddingVertical: 8, paddingHorizontal: 12, textStyle: { fontSize: 14 } },
    md: { paddingVertical: 10, paddingHorizontal: 16, textStyle: { fontSize: 16 } },
  };

  // variant styles
  const variantStyles: Record<"primary" | "outline", { button: ViewStyle; text: TextStyle }> = {
    primary: {
      button: { backgroundColor: colors.buttonPrimary },
      text: { color: colors.buttonPrimaryText },
    },
    outline: {
      button: {
        backgroundColor: colors.buttonOutline,
        borderWidth: 1,
        borderColor: colors.border,
      },
      text: { color: colors.buttonOutlineText },
    },
  };

  const { paddingVertical, paddingHorizontal, textStyle } = sizeStyles[size];
  const { button, text } = variantStyles[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        button,
        {
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
          paddingHorizontal,
          paddingVertical,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {startIcon && <View style={styles.icon}>{startIcon}</View>}
        <Text style={[styles.text, text, textStyle]}>{children}</Text>
        {endIcon && <View style={styles.icon}>{endIcon}</View>}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  icon: {
    marginHorizontal: 4,
  },
  text: {
    fontWeight: "500",
  },
});

export default Button;
