// components/Header.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';

export default function Header({ title }) {
  const { isDark } = useTheme();

  return (
    <View
      style={[
        s.header,
        {
          backgroundColor: '#2B4C7E', // نفس لون التاب بار
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 3,
          elevation: 4,
        },
      ]}
    >
      <Text
        style={[
          s.title,
          {
            color: '#FFFFFF', // نفس لون الأيقونات النشطة
            opacity: isDark ? 1 : 0.95,
          },
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    width: '100%',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
