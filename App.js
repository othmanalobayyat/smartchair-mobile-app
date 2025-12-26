// App.js
import React, { useEffect } from "react";
import { StatusBar, ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { ThemeProvider } from "./hooks/ThemeContext";
import { DataProvider } from "./hooks/DataContext";
import { loadLanguage } from "./hooks/i18n";
import { AuthProvider, useAuth } from "./hooks/AuthContext";
import i18n from "./hooks/i18n";
import { SettingsProvider } from "./hooks/SettingsContext";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";

// الشاشات
import SmartChairScreen from "./screens/SmartChair/SmartChairScreen";
import StatisticsScreen from "./screens/Statistics/StatisticsScreen";
import Coach from "./screens/Coach";
import Settings from "./screens/Settings";
import HistoricalScreen from "./screens/Historical/HistoricalScreen";
import Account from "./screens/SettingsScreens/Account";
import About from "./screens/SettingsScreens/About";
import Support from "./screens/SettingsScreens/Support";
import ChairProvisioning from "./screens/SettingsScreens/ChairProvisioning";
import EditProfile from "./screens/SettingsScreens/EditProfile";
import ChangePassword from "./screens/SettingsScreens/ChangePassword";
import CameraPairing from "./screens/SettingsScreens/CameraPairing";

// شاشات الـ Auth
import Login from "./screens/Auth/Login";
import Register from "./screens/Auth/Register";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

function Tabs() {
  return (
    <>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />

      <Tab.Navigator
        initialRouteName="Dashboard"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            const size = 26;

            if (route.name === "Dashboard")
              return (
                <MaterialCommunityIcons
                  name="chair-school"
                  size={size}
                  color={color}
                />
              );

            if (route.name === "Statistics")
              return <Ionicons name="stats-chart" size={size} color={color} />;

            if (route.name === "Coach")
              return (
                <FontAwesome5 name="heartbeat" size={size} color={color} />
              );

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
        <Tab.Screen
          name="Dashboard"
          component={SmartChairScreen}
          options={{ title: i18n.t("tabDashboard") }}
        />

        <Tab.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{ title: i18n.t("tabStatistics") }}
        />

        <Tab.Screen
          name="Coach"
          component={Coach}
          options={{ title: i18n.t("tabCoach") }}
        />

        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{ title: i18n.t("tabSettings") }}
        />
      </Tab.Navigator>
    </>
  );
}

// Stack التطبيق الأساسي بعد تسجيل الدخول
function AppStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="Historical" component={HistoricalScreen} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="Support" component={Support} />
      <Stack.Screen name="ChairProvisioning" component={ChairProvisioning} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="CameraPairing" component={CameraPairing} />
    </Stack.Navigator>
  );
}

// Stack شاشة الدخول/التسجيل
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
    </AuthStack.Navigator>
  );
}

// Root يقرر: Auth أو App
function RootNavigator() {
  const { user, loading } = useAuth();

  useEffect(() => {
    loadLanguage();
  }, []);

  if (loading) {
    // شاشة تحميل بسيطة
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0F172A",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#4C89C8" />
      </View>
    );
  }

  return user ? <AppStackNavigator /> : <AuthStackNavigator />;
}

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <DataProvider>
          <AuthProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </AuthProvider>
        </DataProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
