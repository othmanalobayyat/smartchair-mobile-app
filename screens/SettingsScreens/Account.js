import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/ThemeContext';

export default function Account({ navigation }) {
  const { theme, isDark } = useTheme();
  const [user, setUser] = useState({
    name: 'عثمان العُبيّات',
    email: 'othman@pau.edu.ps',
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const saved = await AsyncStorage.getItem('userInfo');
        if (saved) setUser(JSON.parse(saved));
      } catch {}
    };
    loadUser();
  }, []);

  const handleEdit = () =>
    Alert.alert('✏️', 'ميزة تعديل البيانات ستتوفر لاحقًا');
  const handlePassword = () =>
    Alert.alert('🔐', 'ميزة تغيير كلمة المرور ستتوفر قريبًا');
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userInfo');
    Alert.alert('🚪', 'تم تسجيل الخروج بنجاح');
    navigation.navigate('Tabs');
  };

  return (
    <View
      style={[
        s.container,
        { backgroundColor: isDark ? '#0F172A' : theme.background },
      ]}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />
      <SafeAreaView style={s.headerContainer} edges={['top']}>
        <View style={s.headerRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={s.backBtn}
            activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={s.headerTitle}>👤 إعدادات الحساب</Text>
        </View>
      </SafeAreaView>

      <View style={s.content}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
          }}
          style={s.avatar}
        />
        <Text style={[s.name, { color: theme.text }]}>{user.name}</Text>
        <Text style={[s.email, { color: isDark ? '#AFCBFF' : '#4C89C8' }]}>
          {user.email}
        </Text>

        <View
          style={[s.card, { backgroundColor: isDark ? '#1C2433' : '#FFF' }]}>
          <TouchableOpacity onPress={handleEdit} style={s.row}>
            <Ionicons name="create-outline" size={22} color="#4C89C8" />
            <Text style={[s.label, { color: theme.text }]}>
              تعديل البيانات الشخصية
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePassword}
            style={[s.row, { marginTop: 12 }]}>
            <Ionicons name="lock-closed-outline" size={22} color="#4C89C8" />
            <Text style={[s.label, { color: theme.text }]}>
              تغيير كلمة المرور
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.8}
          style={[s.mainBtn, { backgroundColor: '#E74C3C' }]}>
          <Ionicons name="log-out-outline" size={20} color="#FFF" />
          <Text style={s.mainBtnTxt}>تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    backgroundColor: '#2B4C7E',
    paddingBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: '700' },
  content: { alignItems: 'center', paddingVertical: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 18, fontWeight: '700' },
  email: { fontSize: 14, marginBottom: 20 },
  card: {
    width: '92%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E0E5EE',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: 16, fontWeight: '600' },
  mainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '92%',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 25,
    gap: 6,
  },
  mainBtnTxt: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: 15,
    top: 2,
    padding: 4,
  },
});
