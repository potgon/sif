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
          name="calendar"
          options={{
            title: "Calendar",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="blank"
          options={{
            title: "Blank",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </AppLayout>
  );
}