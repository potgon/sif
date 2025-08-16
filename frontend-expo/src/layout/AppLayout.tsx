import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

interface LayoutContentProps {
  children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
  const { isMobileOpen } = useSidebar();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.layout}>
        {isMobileOpen && <AppSidebar />}
        <View style={styles.mainContent}>
          <AppHeader />
          <View style={styles.content}>{children}</View>
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
    backgroundColor: "#F9FAFB",
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
    padding: 16,
  },
});

export default AppLayout;