import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, TextInput, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/appStore";
import { ADDICTION_TYPES } from "@/constants/addictions";
import { calculateSavings } from "@/utils/savingsCalculator";
import { Settings, Bell, Award, DollarSign, LogOut, Edit2 } from "lucide-react-native";
import * as Haptics from "expo-haptics";

export default function ProfileScreen() {
  const router = useRouter();
  const { 
    addictionType, 
    startDate, 
    goalDays, 
    dailyAmount, 
    dailyCost,
    setDailyAmount,
    setDailyCost,
    resetApp
  } = useAppStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmount, setEditedAmount] = useState(dailyAmount?.toString() || "");
  const [editedCost, setEditedCost] = useState(dailyCost?.toString() || "");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [crisisAlertsEnabled, setCrisisAlertsEnabled] = useState(true);
  
  const addiction = ADDICTION_TYPES.find(a => a.id === addictionType) || ADDICTION_TYPES[0];
  const daysPassed = Math.floor((new Date().getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24));
  const savings = calculateSavings(daysPassed, dailyCost);
  
  const handleSaveChanges = () => {
    const amount = parseInt(editedAmount);
    const cost = parseInt(editedCost);
    
    if (isNaN(amount) || isNaN(cost) || amount <= 0 || cost <= 0) {
      Alert.alert("Hata", "Lütfen geçerli değerler girin.");
      return;
    }
    
    setDailyAmount(amount);
    setDailyCost(cost);
    setIsEditing(false);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  
  const handleReset = () => {
    Alert.alert(
      "Uygulamayı Sıfırla",
      "Tüm ilerlemeniz silinecek. Emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel"
        },
        {
          text: "Sıfırla",
          onPress: () => {
            resetApp();
            router.replace("/onboarding");
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>
              {addiction.name.charAt(0)}
            </Text>
          </View>
          
          <Text style={styles.profileTitle}>
            {addiction.name} Bağımlılığını Bırakıyorsun
          </Text>
          
          <Text style={styles.profileSubtitle}>
            {daysPassed} gündür temizsin!
          </Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Award size={24} color="#4CAF50" />
            <Text style={styles.statValue}>
              {daysPassed >= 30 ? 3 : daysPassed >= 7 ? 2 : daysPassed >= 1 ? 1 : 0}
            </Text>
            <Text style={styles.statLabel}>Rozet</Text>
          </View>
          
          <View style={styles.statCard}>
            <DollarSign size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{savings} ₺</Text>
            <Text style={styles.statLabel}>Tasarruf</Text>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bağımlılık Bilgileri</Text>
            
            {!isEditing && (
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Edit2 size={18} color="#4CAF50" />
              </TouchableOpacity>
            )}
          </View>
          
          {isEditing ? (
            <View style={styles.editForm}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Günlük {addiction.name} Miktarı ({addiction.unit})
                </Text>
                <TextInput
                  style={styles.formInput}
                  value={editedAmount}
                  onChangeText={setEditedAmount}
                  keyboardType="numeric"
                  placeholder={`Örn: ${addiction.dailyAmount}`}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>
                  Günlük Harcama (₺)
                </Text>
                <TextInput
                  style={styles.formInput}
                  value={editedCost}
                  onChangeText={setEditedCost}
                  keyboardType="numeric"
                  placeholder="Örn: 50"
                />
              </View>
              
              <View style={styles.formActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSaveChanges}
                >
                  <Text style={styles.saveButtonText}>Kaydet</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Bağımlılık Türü</Text>
                <Text style={styles.infoValue}>{addiction.name}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Başlangıç Tarihi</Text>
                <Text style={styles.infoValue}>
                  {new Date(startDate).toLocaleDateString("tr-TR")}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Hedef</Text>
                <Text style={styles.infoValue}>{goalDays} gün</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Günlük Miktar</Text>
                <Text style={styles.infoValue}>
                  {dailyAmount} {addiction.unit}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Günlük Maliyet</Text>
                <Text style={styles.infoValue}>{dailyCost} ₺</Text>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Bildirimler</Text>
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Günlük Motivasyon</Text>
              <Text style={styles.settingDescription}>
                Her gün motivasyon mesajları al
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#ccc", true: "#A5D6A7" }}
              thumbColor={notificationsEnabled ? "#4CAF50" : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Kriz Anı Hatırlatıcıları</Text>
              <Text style={styles.settingDescription}>
                Zorlandığın saatlerde destek mesajları al
              </Text>
            </View>
            <Switch
              value={crisisAlertsEnabled}
              onValueChange={setCrisisAlertsEnabled}
              trackColor={{ false: "#ccc", true: "#A5D6A7" }}
              thumbColor={crisisAlertsEnabled ? "#4CAF50" : "#f4f3f4"}
            />
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push("/settings")}
          >
            <Settings size={20} color="#444" />
            <Text style={styles.actionText}>Ayarlar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleReset}
          >
            <LogOut size={20} color="#FF5252" />
            <Text style={[styles.actionText, styles.dangerText]}>Sıfırla</Text>
          </TouchableOpacity>
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
  header: {
    alignItems: "center",
    padding: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  profileSubtitle: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    width: "45%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  editButton: {
    padding: 5,
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  editForm: {
    gap: 15,
  },
  formGroup: {
    marginBottom: 10,
  },
  formLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  formInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
  },
  actionsContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  actionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  dangerText: {
    color: "#FF5252",
  },
});