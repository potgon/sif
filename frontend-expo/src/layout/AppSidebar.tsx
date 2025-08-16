import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSidebar } from "../context/SidebarContext";
import { router } from "expo-router";

type NavItem = {
  name: string;
  icon: string;
  path?: string;
  subItems?: { name: string; path: string }[];
};

const navItems: NavItem[] = [
  {
    icon: "grid-outline",
    name: "Dashboard",
    subItems: [
      { name: "Gastos", path: "/(tabs)/home" },
      { name: "Inversiones", path: "/(tabs)/blank" },
    ],
  },
  {
    icon: "calendar-outline",
    name: "Calendar",
    path: "/(tabs)/calendar",
  },
];

const AppSidebar: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const handleNavigation = (path: string) => {
    router.push(path as any);
    toggleMobileSidebar(); // Close sidebar after navigation
  };

  const renderMenuItems = (items: NavItem[]) => (
    <View style={styles.menuList}>
      {items.map((nav, index) => (
        <View key={nav.name}>
          {nav.subItems ? (
            <TouchableOpacity
              onPress={() => handleSubmenuToggle(index)}
              style={[
                styles.menuItem,
                openSubmenu === index && styles.menuItemActive,
              ]}
            >
              <Ionicons
                name={nav.icon as any}
                size={24}
                color={openSubmenu === index ? "#465FFF" : "#6B7280"}
              />
              <Text
                style={[
                  styles.menuText,
                  openSubmenu === index && styles.menuTextActive,
                ]}
              >
                {nav.name}
              </Text>
              <Ionicons
                name={openSubmenu === index ? "chevron-up" : "chevron-down"}
                size={20}
                color={openSubmenu === index ? "#465FFF" : "#6B7280"}
              />
            </TouchableOpacity>
          ) : (
            nav.path && (
              <TouchableOpacity
                onPress={() => handleNavigation(nav.path!)}
                style={styles.menuItem}
              >
                <Ionicons name={nav.icon as any} size={24} color="#6B7280" />
                <Text style={styles.menuText}>{nav.name}</Text>
              </TouchableOpacity>
            )
          )}
          {nav.subItems && openSubmenu === index && (
            <View style={styles.submenu}>
              {nav.subItems.map((subItem) => (
                <TouchableOpacity
                  key={subItem.name}
                  onPress={() => handleNavigation(subItem.path)}
                  style={styles.submenuItem}
                >
                  <Text style={styles.submenuText}>{subItem.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <Modal
      visible={isMobileOpen}
      transparent={true}
      animationType="slide"
      onRequestClose={toggleMobileSidebar}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={toggleMobileSidebar}
        />
        <View style={styles.sidebar}>
          <View style={styles.header}>
            <Text style={styles.logo}>SIF</Text>
            <TouchableOpacity onPress={toggleMobileSidebar}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MENU</Text>
              {renderMenuItems(navItems)}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sidebar: {
    width: 290,
    backgroundColor: "#ffffff",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  menuList: {
    gap: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 12,
  },
  menuItemActive: {
    backgroundColor: "#EEF2FF",
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  menuTextActive: {
    color: "#465FFF",
  },
  submenu: {
    marginLeft: 36,
    marginTop: 8,
    gap: 4,
  },
  submenuItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submenuText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
});

export default AppSidebar;