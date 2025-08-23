import React from "react";
import { View, StyleSheet, SafeAreaView, Platform, StatusBar as RNStatusBar } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { useAppTheme } from "../theme/useAppTheme";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

interface LayoutContentProps {
  children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
  const { isMobileOpen } = useSidebar();
  const { colors, isDark } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      {/* Android status bar height adjustment */}
      {Platform.OS === 'android' && (
        <View style={[styles.androidStatusBar, { backgroundColor: colors.headerBackground }]} />
      )}
      <View style={styles.layout}>
        {isMobileOpen && <AppSidebar />}
        <View style={styles.mainContent}>
          <AppHeader />
          <View style={[styles.content, { backgroundColor: colors.background }]}>
            {children}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  androidStatusBar: {
    height: RNStatusBar.currentHeight || 0,
    width: '100%',
  },
  layout: {
    flex: 1,
    flexDirection: "row",
  },
  mainContent: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Platform.OS === 'ios' ? 16 : 20, // iOS needs less padding, Android more
    paddingTop: Platform.OS === 'ios' ? 8 : 12, // Adjust top padding for platform differences
  },
});

export default AppLayout;