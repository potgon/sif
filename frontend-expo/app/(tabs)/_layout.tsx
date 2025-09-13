import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppLayout from "@/src/layout/AppLayout";

export default function TabsLayout() {
  return (
    <AppLayout>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            display: "none", // Hide tab bar since we're using sidebar navigation
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Transacciones",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="investments"
          options={{
            title: "Inversiones",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="trending-up" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="blank"
          options={{
            title: "Configuración",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </AppLayout>
  );
}