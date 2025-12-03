// App.js
import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { ThemeProvider } from "./hooks/ThemeContext";
import { DataProvider } from "./hooks/DataContext";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";

// الشاشات
import SmartChair from "./screens/SmartChair";
import Statistics from "./screens/Statistics";
import Coach from "./screens/Coach";
import Settings from "./screens/Settings";
import Historical from "./screens/StatisticsScreens/Historical";
import Account from "./screens/SettingsScreens/Account";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Tabs() {
  return (
    <>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      <Tab.Navigator
        initialRouteName="Dashboard"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            const size = 26;

            if (route.name === "Dashboard")
              return <MaterialCommunityIcons name="chair-school" size={size} color={color} />;

            if (route.name === "Statistics")
              return <Ionicons name="stats-chart" size={size} color={color} />;

            if (route.name === "Coach")
              return <FontAwesome5 name="heartbeat" size={size} color={color} />;

            if (route.name === "Settings")
              return <Ionicons name="settings" size={size} color={color} />;
          },
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#2B4C7E",
            borderTopWidth: 0,
            height: 60,
            paddingBottom: 5,
          },
          tabBarActiveTintColor: "#FFFFFF",
          tabBarInactiveTintColor: "#AFC3E1",
        })}
      >
        <Tab.Screen name="Dashboard" component={SmartChair} options={{ title: "الرئيسية" }} />
        <Tab.Screen name="Statistics" component={Statistics} options={{ title: "الإحصاءات" }} />
        <Tab.Screen name="Coach" component={Coach} options={{ title: "المساعد" }} />
        <Tab.Screen name="Settings" component={Settings} options={{ title: "الإعدادات" }} />
      </Tab.Navigator>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="Tabs" component={Tabs} />
            <Stack.Screen name="Historical" component={Historical} />
            <Stack.Screen name="Account" component={Account} />
          </Stack.Navigator>
        </NavigationContainer>
      </DataProvider>
    </ThemeProvider>
  );
}
