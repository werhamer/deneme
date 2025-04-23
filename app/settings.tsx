import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Bell, Moon, Lock, HelpCircle, Info, ChevronRight } from "lucide-react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  
  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) => {
      Alert.alert("Hata", "Bağlantı açılamadı");
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Görünüm</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Moon size={20} color="#666" />
              <Text style={styles.settingLabel}>Karanlık Mod</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#ccc", true: "#A5D6A7" }}
              thumbColor={darkMode ? "#4CAF50" : "#f4f3f4"}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bildirimler</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Bell size={20} color="#666" />
              <Text style={styles.settingLabel}>Bildirimler</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#ccc", true: "#A5D6A7" }}
              thumbColor={notifications ? "#4CAF50" : "#f4f3f4"}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gizlilik</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Lock size={20} color="#666" />
              <Text style={styles.settingLabel}>Gizlilik Modu</Text>
            </View>
            <Switch
              value={privacyMode}
              onValueChange={setPrivacyMode}
              trackColor={{ false: "#ccc", true: "#A5D6A7" }}
              thumbColor={privacyMode ? "#4CAF50" : "#f4f3f4"}
            />
          </View>
          
          <Text style={styles.settingDescription}>
            Gizlilik modu açıkken, uygulama içeriği başkaları tarafından görüntülenemez.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destek</Text>
          
          <TouchableOpacity style={styles.linkRow}>
            <View style={styles.settingInfo}>
              <HelpCircle size={20} color="#666" />
              <Text style={styles.settingLabel}>Yardım Merkezi</Text>
            </View>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkRow}
            onPress={() => handleOpenLink("https://www.yesilay.org.tr")}
          >
            <View style={styles.settingInfo}>
              <Info size={20} color="#666" />
              <Text style={styles.settingLabel}>Yeşilay Hakkında</Text>
            </View>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yasal</Text>
          
          <TouchableOpacity 
            style={styles.linkRow}
            onPress={() => handleOpenLink("https://example.com/privacy")}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Gizlilik Politikası</Text>
            </View>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkRow}
            onPress={() => handleOpenLink("https://example.com/terms")}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Kullanım Koşulları</Text>
            </View>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Sürüm 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: "#fff",
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 15,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    marginBottom: 5,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  versionContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  versionText: {
    fontSize: 14,
    color: "#666",
  },
});