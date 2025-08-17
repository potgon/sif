import React from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/button/Buton";

const AppHeader: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();
  const { logout } = useAuth();

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
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.toggleButton} onPress={handleToggle}>
            {isMobileOpen ? (
              <Ionicons name="close" size={24} color="#6B7280" />
            ) : (
              <Ionicons name="menu" size={24} color="#6B7280" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.themeButton}
            onPress={() => console.log("Theme toggle")}
          >
            <Ionicons name="moon" size={20} color="#6B7280" />
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
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
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
    borderColor: "#E5E7EB",
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