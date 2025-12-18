// components/Header.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/ThemeContext";

export default function AppHeader({
  title,
  onBack,
  rightIcon = null,
  onRightPress,
  subtitle,
}) {
  const { theme, isDark } = useTheme();

  return (
    <>
      <StatusBar
        translucent
        barStyle={isDark ? "light-content" : "light-content"}
        backgroundColor="transparent"
      />

      <SafeAreaView
        edges={["top"]}
        style={[s.header, { backgroundColor: theme.primary }]}
      >
        <View style={s.inner}>
          {/* LEFT */}
          {onBack ? (
            <TouchableOpacity onPress={onBack} style={s.iconBtn}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={theme.iconOnPrimary}
              />
            </TouchableOpacity>
          ) : (
            <View style={s.iconPlaceholder} />
          )}

          {/* CENTER */}
          <View style={s.center}>
            <Text style={[s.title, { color: theme.iconOnPrimary }]}>
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={[
                  s.subtitle,
                  { color: theme.iconOnPrimary, opacity: 0.85 },
                ]}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>

          {/* RIGHT */}
          {rightIcon ? (
            <TouchableOpacity onPress={onRightPress} style={s.iconBtn}>
              <Ionicons
                name={rightIcon}
                size={22}
                color={theme.iconOnPrimary}
              />
            </TouchableOpacity>
          ) : (
            <View style={s.iconPlaceholder} />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const s = StyleSheet.create({
  header: {
    width: "100%",
    paddingBottom: 10,
  },

  inner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 6,
  },

  iconBtn: {
    padding: 6,
  },

  iconPlaceholder: {
    width: 36,
  },

  center: {
    flex: 1,
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
  },

  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
