// ChatBot.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
  Keyboard,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";

export default function ChatBot({ visible, onClose, posture, sessionMinutes }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "مرحباً! أنا مساعد الجلسة الذكي 👋" },
  ]);
  const [inputText, setInputText] = useState("");
  const [typing, setTyping] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollRef = useRef(null);
  const chatAnim = useRef(new Animated.Value(0)).current;
  const soundRef = useRef(null);

  const botReplies = {
    صحيحة: "جلستك ممتازة! استمر بهذه الوضعية.",
    منحنية: "ظهرك مائل—حاول ترجع كتفيك للخلف.",
    تعب: "أنصحك بتمارين التمدد التي تظهر أمامك.",
    طويلة: "جلستك أصبحت طويلة—خذ استراحة بسيطة.",
    default: "تستطيع سؤالي عن وضعك أو طلب نصيحة أو تمرين.",
  };

  /* ================= KEYBOARD SPACE ================= */
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  /* ================= ANIMATION ================= */
  useEffect(() => {
    if (visible) {
      setTyping(false);
      chatAnim.setValue(0);
      Animated.timing(chatAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const chatTranslateY = chatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  /* ================= SOUND ================= */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/chat-pop.mp3")
        );
        if (mounted) soundRef.current = sound;
      } catch {}
    })();
    return () => {
      mounted = false;
      soundRef.current?.unloadAsync();
    };
  }, []);

  const playNotification = async () => {
    try {
      await soundRef.current?.replayAsync();
    } catch {}
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const msg = inputText;
    setMessages((p) => [...p, { from: "user", text: msg }]);
    setInputText("");
    setTyping(true);

    setTimeout(() => {
      const reply = botReplies[posture] || botReplies.default;
      setMessages((p) => [...p, { from: "bot", text: reply }]);
      setTyping(false);
      playNotification();
    }, 700);
  };

  const handleQuickReply = (type) => {
    let userMsg = "";
    let botMsg = "";

    if (type === "status") {
      userMsg = "كيف وضعي الآن؟";
      botMsg = botReplies[posture] || botReplies.default;
    } else if (type === "exercise") {
      userMsg = "أعطني تمرين.";
      botMsg =
        posture === "تعب"
          ? "أنصحك بتمدد الرقبة والكتفين."
          : "جرّب تمرين الذراعين أو لف الرقبة.";
    } else if (type === "break") {
      userMsg = "هل أحتاج استراحة؟";
      botMsg =
        sessionMinutes >= 40
          ? "نعم! الأفضل تأخذ استراحة الآن."
          : "لسا عندك وقت، لكن لو تعبان خذ بريك.";
    }

    setMessages((p) => [...p, { from: "user", text: userMsg }]);
    setTyping(true);

    setTimeout(() => {
      setMessages((p) => [...p, { from: "bot", text: botMsg }]);
      setTyping(false);
      playNotification();
    }, 600);
  };

  if (!visible) return null;

  return (
    <View style={styles.chatOverlay}>
      <Animated.View
        style={[
          styles.chatWindow,
          { transform: [{ translateY: chatTranslateY }] },
        ]}
      >
        {/* HEADER */}
        <View style={styles.chatHeader}>
          <TouchableOpacity
            onPress={() => {
              setTyping(false);
              onClose();
              Keyboard.dismiss();
            }}
          >
            <MaterialIcons name="close" size={28} color="#2B4C7E" />
          </TouchableOpacity>

          <View style={styles.chatTitleRow}>
            <View style={styles.botAvatar}>
              <Ionicons name="chatbubbles-outline" size={18} color="#2B4C7E" />
            </View>
            <Text style={styles.chatTitle}>Smart Coach Chat</Text>
          </View>
        </View>

        {/* MESSAGES */}
        <ScrollView
          ref={scrollRef}
          style={styles.chatMessages}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((m, i) => (
            <View
              key={i}
              style={[
                styles.msgBubble,
                m.from === "bot" ? styles.botBubble : styles.userBubble,
              ]}
            >
              {m.from === "bot" && (
                <Ionicons
                  name="person-circle-outline"
                  size={22}
                  color="#2B4C7E"
                  style={{ marginRight: 6 }}
                />
              )}
              <Text
                style={m.from === "bot" ? styles.botText : styles.userText}
              >
                {m.text}
              </Text>
            </View>
          ))}

          {typing && (
            <View style={[styles.msgBubble, styles.botBubble]}>
              <Text style={styles.botText}>...</Text>
            </View>
          )}
        </ScrollView>

        {/* QUICK */}
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickPill}
            onPress={() => handleQuickReply("status")}
          >
            <Text style={styles.quickText}>حالتي؟</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickPill}
            onPress={() => handleQuickReply("exercise")}
          >
            <Text style={styles.quickText}>تمريني</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickPill}
            onPress={() => handleQuickReply("break")}
          >
            <Text style={styles.quickText}>استراحة</Text>
          </TouchableOpacity>
        </View>

        {/* INPUT */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputBox}
            placeholder="اكتب رسالة..."
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* ✅ KEYBOARD SPACE */}
        {keyboardHeight > 0 && (
          <View style={{ height: Platform.OS === "ios" ? keyboardHeight - 20 : keyboardHeight }} />
        )}
      </Animated.View>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  chatOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },
  chatWindow: {
    height: "80%",
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  chatHeader: { flexDirection: "row", alignItems: "center" },
  chatTitleRow: { flexDirection: "row", alignItems: "center", marginLeft: 8 },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E7EEFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  chatTitle: { fontSize: 18, fontWeight: "700", color: "#2B4C7E" },
  chatMessages: { flex: 1, marginTop: 6 },
  msgBubble: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 18,
    marginVertical: 4,
    maxWidth: "80%",
    alignItems: "center",
  },
  botBubble: { backgroundColor: "#E7EEFF", alignSelf: "flex-start" },
  userBubble: { backgroundColor: "#2B4C7E", alignSelf: "flex-end" },
  botText: { color: "#1e3a8a", fontSize: 15 },
  userText: { color: "white", fontSize: 15 },
  quickRow: { flexDirection: "row", marginVertical: 8 },
  quickPill: {
    flex: 1,
    backgroundColor: "#E7EEFF",
    marginHorizontal: 4,
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  quickText: { color: "#2B4C7E", fontWeight: "600" },
  inputRow: { flexDirection: "row", alignItems: "center" },
  inputBox: {
    flex: 1,
    backgroundColor: "#F2F4F7",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#2B4C7E",
    borderRadius: 20,
    padding: 10,
  },
});
