import React from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../hooks/useAuth";
import { useAppTheme } from "../theme/useAppTheme";
import Button from "../components/ui/button/Buton";

const AppHeader: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();
  const { logout } = useAuth();
  const { colors, isDark, toggleTheme } = useAppTheme();

  const handleToggle = () => {
    toggleMobileSidebar();
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: logout
        }
      ]
    );
  };

  return (
    <View style={[styles.header, { 
      backgroundColor: colors.headerBackground,
      borderBottomColor: colors.headerBorder 
    }]}>
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          <TouchableOpacity 
            style={[styles.toggleButton, { 
              borderColor: colors.border,
              backgroundColor: colors.surface 
            }]} 
            onPress={handleToggle}
          >
            {isMobileOpen ? (
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            ) : (
              <Ionicons name="menu" size={24} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: colors.surface }]}
            onPress={toggleTheme}
          >
            <Ionicons 
              name={isDark ? "sunny" : "moon"} 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>

          <Button onPress={handleLogout} variant="outline" size="sm">
            Cerrar sesión
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  toggleButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  themeButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppHeader;