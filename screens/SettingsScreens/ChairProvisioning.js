// screens/SettingsScreens/ChairProvisioning.js
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BleManager } from "react-native-ble-plx";
import { useTheme } from "../../hooks/ThemeContext";

const manager = new BleManager();

export default function ChairProvisioning({ navigation }) {
  const { theme } = useTheme();

  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  // ------------------------------------------------------
  // 1) Request Android permissions
  // ------------------------------------------------------
  const requestBlePermissions = async () => {
    if (Platform.OS !== "android") return true;

    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      const allGranted = Object.values(granted).every(
        (v) => v === PermissionsAndroid.RESULTS.GRANTED
      );

      return allGranted;
    } catch {
      return false;
    }
  };

  // ------------------------------------------------------
  // 2) Scan for SmartChair BLE devices
  // ------------------------------------------------------
  const handleScan = async () => {
    const perms = await requestBlePermissions();
    if (!perms) {
      alert("يجب السماح بالأذونات لتشغيل البلوتوث.");
      return;
    }

    manager.stopDeviceScan();
    setDevices([]);
    setScanning(true);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("SCAN ERROR:", error);
        setScanning(false);
        return;
      }

      if (device && device.name && device.name.startsWith("SmartChair")) {
        setDevices((prev) => {
          if (prev.find((d) => d.id === device.id)) return prev;
          return [...prev, device];
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
    }, 6000);
  };

  // ------------------------------------------------------
  // 3) Send WiFi credentials over BLE (USING global.btoa)
  // ------------------------------------------------------
  const WIFI_SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
  const WIFI_CHARACTERISTIC_UUID = "abcd1234-5678-90ab-cdef-1234567890ab";

  const handleSend = async () => {
    if (!ssid || !password) {
      alert("أدخل اسم الشبكة وكلمة المرور");
      return;
    }

    if (!selected) {
      alert("اختر كرسي من القائمة");
      return;
    }

    setSending(true);

    try {
      const device = devices.find((d) => d.id === selected);

      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();

      const services = await connected.services();
      const service = services.find(
        (s) => s.uuid.toUpperCase() === WIFI_SERVICE_UUID.toUpperCase()
      );

      if (!service) throw new Error("Service not found");

      const characteristics = await connected.characteristicsForService(
        service.uuid
      );

      const characteristic = characteristics.find(
        (c) => c.uuid.toUpperCase() === WIFI_CHARACTERISTIC_UUID.toUpperCase()
      );

      if (!characteristic) throw new Error("Characteristic not found");

      // -----------------------------
      // BASE64 ENCODING WITHOUT LIB
      // -----------------------------
      const json = JSON.stringify({ ssid, password });

      // استخدم global.btoa بدل مكتبات خارجية
      const base64Payload = global.btoa(unescape(encodeURIComponent(json)));

      console.log("BASE64:", base64Payload);

      await characteristic.writeWithResponse(base64Payload);

      setSending(false);
      setDone(true);
    } catch (err) {
      console.log("SEND ERROR:", err);
      setSending(false);
      alert("حدث خطأ أثناء إرسال البيانات");
    }
  };

  // ------------------------------------------------------
  // UI
  // ------------------------------------------------------
  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />

      <SafeAreaView style={s.header} edges={["top"]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={s.headerTitle}>إعداد اتصال الكرسي</Text>
      </SafeAreaView>

      <TouchableOpacity
        onPress={handleScan}
        style={[s.btn, { backgroundColor: theme.primary }]}
      >
        <Text style={s.btnTxt}>بحث عن الكرسي</Text>
      </TouchableOpacity>

      {scanning && (
        <ActivityIndicator color={theme.primary} style={{ marginTop: 10 }} />
      )}

      {devices.map((d) => (
        <TouchableOpacity
          key={d.id}
          style={[
            s.device,
            { borderColor: selected === d.id ? theme.primary : theme.border },
          ]}
          onPress={() => setSelected(d.id)}
        >
          <Text style={{ color: theme.text }}>{d.name}</Text>
          <Text style={{ color: theme.textSecondary, fontSize: 12 }}>
            {d.id}
          </Text>
        </TouchableOpacity>
      ))}

      {selected && (
        <>
          <Text style={[s.label, { color: theme.text }]}>اسم الشبكة</Text>
          <TextInput
            style={[s.input, { borderColor: theme.border, color: theme.text }]}
            placeholder="SSID"
            placeholderTextColor="#999"
            value={ssid}
            onChangeText={setSsid}
          />

          <Text style={[s.label, { color: theme.text }]}>كلمة المرور</Text>
          <TextInput
            style={[s.input, { borderColor: theme.border, color: theme.text }]}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={handleSend}
            style={[s.btn, { backgroundColor: theme.secondary }]}
          >
            {sending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={s.btnTxt}>إرسال الإعدادات</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {done && (
        <Text style={[s.success, { color: theme.success }]}>
          تم ربط الكرسي بالشبكة بنجاح! 🎉
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: "#2B4C7E",
    width: "100%",
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    paddingVertical: 6,
    paddingRight: 10,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },
  btn: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  btnTxt: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  device: {
    padding: 14,
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 10,
  },
  label: { marginTop: 20, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  success: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "700",
  },
});
