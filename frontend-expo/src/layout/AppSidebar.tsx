import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSidebar } from "../context/SidebarContext";
import { useAppTheme } from "../theme/useAppTheme";
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
      { name: "Inversiones", path: "/(tabs)/investments" },
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
  const { colors } = useAppTheme();
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
                { backgroundColor: colors.sidebarBackground },
                openSubmenu === index && { backgroundColor: colors.sidebarActive },
              ]}
            >
              <Ionicons
                name={nav.icon as any}
                size={24}
                color={openSubmenu === index ? colors.info : colors.sidebarText}
              />
              <Text
                style={[
                  styles.menuText,
                  { color: colors.sidebarText },
                  openSubmenu === index && { color: colors.sidebarActiveText },
                ]}
              >
                {nav.name}
              </Text>
              <Ionicons
                name={openSubmenu === index ? "chevron-up" : "chevron-down"}
                size={20}
                color={openSubmenu === index ? colors.info : colors.sidebarText}
              />
            </TouchableOpacity>
          ) : (
            nav.path && (
              <TouchableOpacity
                onPress={() => handleNavigation(nav.path!)}
                style={[styles.menuItem, { backgroundColor: colors.sidebarBackground }]}
              >
                <Ionicons name={nav.icon as any} size={24} color={colors.sidebarText} />
                <Text style={[styles.menuText, { color: colors.sidebarText }]}>{nav.name}</Text>
              </TouchableOpacity>
            )
          )}
          {nav.subItems && openSubmenu === index && (
            <View style={styles.submenu}>
              {nav.subItems.map((subItem) => (
                <TouchableOpacity
                  key={subItem.name}
                  onPress={() => handleNavigation(subItem.path)}
                  style={[
                    styles.submenuItem,
                    { backgroundColor: colors.sidebarBackground }
                  ]}
                >
                  <Text style={[styles.submenuText, { color: colors.sidebarText }]}>
                    {subItem.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );

  if (!isMobileOpen) return null;

  return (
    <Modal
      visible={isMobileOpen}
      transparent
      animationType="slide"
      onRequestClose={toggleMobileSidebar}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={[styles.backdrop, { backgroundColor: colors.modalOverlay }]}
          onPress={toggleMobileSidebar}
        />
        <View style={[styles.sidebar, { 
          backgroundColor: colors.sidebarBackground,
          borderRightColor: colors.sidebarBorder 
        }]}>
          <View style={[styles.header, { 
            borderBottomColor: colors.sidebarBorder 
          }]}>
            <Text style={[styles.logo, { color: colors.sidebarActiveText }]}>SIF</Text>
            <TouchableOpacity onPress={toggleMobileSidebar}>
              <Ionicons name="close" size={24} color={colors.sidebarText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>MENU</Text>
              {renderMenuItems(navItems)}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const { width: screenWidth } = Dimensions.get('window');
const sidebarWidth = Math.min(screenWidth * 0.85, 320); // Responsive width, max 320px

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    flex: 1,
  },
  sidebar: {
    width: sidebarWidth,
    borderRightWidth: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Extra padding for iPhone notch
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Platform.OS === 'ios' ? 24 : 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    borderBottomWidth: 1,
  },
  logo: {
    fontSize: 26,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: Platform.OS === 'ios' ? 24 : 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  menuList: {
    gap: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  submenu: {
    marginLeft: 40,
    marginTop: 10,
    gap: 6,
  },
  submenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  submenuText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default AppSidebar;