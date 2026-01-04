// Screens/SettingsScreens/ChairProvisioning.js
import React, { useState, useEffect } from "react";
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
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BleManager } from "react-native-ble-plx";
import AppHeader from "../../components/AppHeader";
import { useTheme } from "../../hooks/ThemeContext";
import { useData } from "../../hooks/DataContext";

const manager = new BleManager();

const WIFI_SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
const WIFI_CHARACTERISTIC_UUID = "abcd1234-5678-90ab-cdef-1234567890ab";

export default function ChairProvisioning({ navigation }) {
  const { theme } = useTheme();
  const { chairOnline } = useData();

  // ================= STATE =================
  const [step, setStep] = useState(1);
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [sending, setSending] = useState(false);

  // ================= CLEANUP =================
  useEffect(() => {
    return () => {
      manager.stopDeviceScan();
      manager.destroy();
    };
  }, []);

  // ================= PERMISSIONS =================
  const requestBlePermissions = async () => {
    if (Platform.OS !== "android") return true;

    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    return Object.values(granted).every(
      (v) => v === PermissionsAndroid.RESULTS.GRANTED
    );
  };

  // ================= SCAN =================
  const handleScan = async () => {
    const ok = await requestBlePermissions();
    if (!ok) {
      Alert.alert("خطأ", "يرجى منح صلاحيات البلوتوث");
      return;
    }

    setDevices([]);
    setScanning(true);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        setScanning(false);
        return;
      }

      if (device?.name?.startsWith("SmartChair")) {
        setDevices((prev) =>
          prev.find((d) => d.id === device.id) ? prev : [...prev, device]
        );
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
    }, 5000);
  };

  // ================= SEND WIFI =================
  const handleSend = async () => {
    if (!ssid || !password || !selected) {
      Alert.alert("تنبيه", "يرجى إدخال بيانات الشبكة");
      return;
    }

    setSending(true);

    try {
      manager.stopDeviceScan();

      const device = await manager.connectToDevice(selected, {
        autoConnect: false,
      });
      await device.discoverAllServicesAndCharacteristics();

      const services = await device.services();
      const service = services.find(
        (s) => s.uuid.toUpperCase() === WIFI_SERVICE_UUID.toUpperCase()
      );

      if (!service) throw new Error("Service not found");

      const chars = await device.characteristicsForService(service.uuid);
      const char = chars.find(
        (c) => c.uuid.toUpperCase() === WIFI_CHARACTERISTIC_UUID.toUpperCase()
      );

      if (!char) throw new Error("Characteristic not found");

      const payload = global.btoa(
        unescape(encodeURIComponent(JSON.stringify({ ssid, password })))
      );

      // استمع لرد ESP32
      const sub = char.monitor((error, characteristic) => {
        if (error || !characteristic?.value) return;

        try {
          const response = JSON.parse(
            decodeURIComponent(escape(global.atob(characteristic.value)))
          );

          if (response.status === "connected") {
            setStep(3);
          } else {
            Alert.alert("فشل", "فشل الاتصال بالشبكة");
            setStep(2);
          }

          sub.remove();
        } catch {
          Alert.alert("خطأ", "رد غير صالح من الكرسي");
          setStep(2);
          sub.remove();
        }
      });

      await char.writeWithResponse(payload);
    } catch (e) {
      Alert.alert("خطأ", "فشل إرسال الإعدادات");
      setStep(2);
    } finally {
      setSending(false);
    }
  };

  // ================= STEP 3 TIMEOUT =================
  useEffect(() => {
    if (step !== 3) return;

    const t = setTimeout(() => {
      if (!chairOnline) {
        Alert.alert("تنبيه", "لم يتم الاتصال بالسيرفر");
        setStep(2);
      }
    }, 15000);

    return () => clearTimeout(t);
  }, [step, chairOnline]);

  // ================= UI =================
  return (
    <View style={[s.container, { backgroundColor: theme.background }]}>
      <StatusBar translucent backgroundColor="transparent" />
      <AppHeader title="إعداد اتصال الكرسي" onBack={navigation.goBack} />

      {chairOnline && (
        <View
          style={[
            s.heroCard,
            { borderColor: theme.success, backgroundColor: "#22c55e20" },
          ]}
        >
          <Ionicons name="wifi" size={40} color={theme.success} />
          <Text style={[s.heroTitle, { color: theme.success }]}>
            الكرسي متصل وجاهز
          </Text>
          <Text style={[s.heroSub, { color: theme.textSecondary }]}>
            اتصال مستقر · يتم إرسال البيانات الآن
          </Text>
        </View>
      )}

      {!chairOnline && (
        <>
          {/* STEPPER */}
          <View style={s.stepper}>
            {["Bluetooth", "Wi-Fi", "جاهز"].map((t, i) => (
              <View key={i} style={s.stepItem}>
                <View
                  style={[
                    s.stepCircle,
                    {
                      backgroundColor:
                        step > i + 1
                          ? theme.success
                          : step === i + 1
                          ? theme.primary
                          : theme.border,
                    },
                  ]}
                >
                  <Text style={s.stepNum}>{i + 1}</Text>
                </View>
                <Text style={[s.stepLabel, { color: theme.text }]}>{t}</Text>
              </View>
            ))}
          </View>

          {/* STEP 1 */}
          {step === 1 && (
            <View style={s.card}>
              <TouchableOpacity
                onPress={handleScan}
                style={[s.mainBtn, { backgroundColor: theme.primary }]}
              >
                <Ionicons name="bluetooth" size={20} color="#FFF" />
                <Text style={s.btnTxt}>بحث عن الكرسي</Text>
              </TouchableOpacity>

              {scanning && <ActivityIndicator style={{ marginTop: 10 }} />}

              {devices.map((d) => (
                <TouchableOpacity
                  key={d.id}
                  onPress={() => {
                    manager.stopDeviceScan();
                    setSelected(d.id);
                    setStep(2);
                  }}
                  style={[
                    s.device,
                    {
                      borderColor:
                        selected === d.id ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Ionicons name="bluetooth" size={18} color={theme.primary} />
                  <Text style={{ marginLeft: 10, color: theme.text }}>
                    {d.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <View style={s.card}>
              <TextInput
                placeholder="Wi-Fi SSID"
                value={ssid}
                onChangeText={setSsid}
                style={s.input}
              />
              <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={s.input}
              />

              <TouchableOpacity
                onPress={handleSend}
                style={[s.mainBtn, { backgroundColor: theme.secondary }]}
              >
                {sending ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="wifi"
                      size={18}
                      color="#FFF"
                    />
                    <Text style={s.btnTxt}>إرسال الإعدادات</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <View style={s.successCard}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={s.successTxt}>جارِ ربط الكرسي بالشبكة...</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  stepper: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  stepItem: { alignItems: "center" },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNum: { color: "#FFF", fontWeight: "700" },
  stepLabel: { fontSize: 12, marginTop: 6 },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF10",
  },
  device: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  mainBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  btnTxt: { color: "#FFF", fontWeight: "700" },
  successCard: {
    alignItems: "center",
    marginTop: 60,
  },
  successTxt: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "700",
  },
  heroCard: {
    margin: 16,
    paddingVertical: 26,
    paddingHorizontal: 20,
    borderRadius: 22,
    alignItems: "center",
    borderWidth: 1,
  },
  heroTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: "800",
  },
  heroSub: {
    marginTop: 6,
    fontSize: 13,
    textAlign: "center",
  },
});
