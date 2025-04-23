import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/appStore";
import { Cigarette, Beer, Dices, Coffee, Cookie, Plus } from "lucide-react-native";
import { ADDICTION_TYPES } from "@/constants/addictions";

export default function OnboardingScreen() {
  const router = useRouter();
  const { setHasOnboarded, setAddictionType, setStartDate, setGoalDays } = useAppStore();
  const [selectedAddiction, setSelectedAddiction] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState(30);

  const handleAddictionSelect = (type: string) => {
    setSelectedAddiction(type);
  };

  const handleNext = () => {
    if (step === 1 && selectedAddiction) {
      setStep(2);
    } else if (step === 2) {
      // Save to store and navigate to main app
      setAddictionType(selectedAddiction || ADDICTION_TYPES[0].id);
      setStartDate(new Date());
      setGoalDays(selectedGoal);
      setHasOnboarded(true);
      router.replace("/(tabs)");
    }
  };

  const renderAddictionIcon = (type: string) => {
    switch (type) {
      case "sigara":
        return <Cigarette size={32} color="#fff" />;
      case "alkol":
        return <Beer size={32} color="#fff" />;
      case "kumar":
        return <Dices size={32} color="#fff" />;
      case "kafein":
        return <Coffee size={32} color="#fff" />;
      case "seker":
        return <Cookie size={32} color="#fff" />;
      default:
        return <Plus size={32} color="#fff" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#4CAF50", "#2E7D32"]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Bağımlılıklarından Kurtul</Text>
        <Text style={styles.headerSubtitle}>
          {step === 1 
            ? "Hangi bağımlılıktan kurtulmak istiyorsun?" 
            : "Hedefini belirle"}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {step === 1 ? (
          <View style={styles.addictionsContainer}>
            {ADDICTION_TYPES.map((addiction) => (
              <TouchableOpacity
                key={addiction.id}
                style={[
                  styles.addictionCard,
                  selectedAddiction === addiction.id && styles.selectedCard,
                ]}
                onPress={() => handleAddictionSelect(addiction.id)}
              >
                <View style={styles.iconContainer}>
                  {renderAddictionIcon(addiction.id)}
                </View>
                <Text style={styles.addictionName}>{addiction.name}</Text>
                <Text style={styles.addictionDesc}>{addiction.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.goalContainer}>
            <Text style={styles.goalTitle}>Kaç gün temiz kalmak istiyorsun?</Text>
            
            <View style={styles.goalOptions}>
              {[7, 30, 90, 365].map((days) => (
                <TouchableOpacity
                  key={days}
                  style={[
                    styles.goalCard,
                    selectedGoal === days && styles.selectedGoal,
                  ]}
                  onPress={() => setSelectedGoal(days)}
                >
                  <Text style={[
                    styles.goalDays,
                    selectedGoal === days && styles.selectedGoalText,
                  ]}>
                    {days}
                  </Text>
                  <Text style={[
                    styles.goalLabel,
                    selectedGoal === days && styles.selectedGoalText,
                  ]}>
                    {days === 7 ? "Hafta" : days === 30 ? "Ay" : days === 90 ? "Çeyrek" : "Yıl"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.motivationBox}>
              <Text style={styles.motivationText}>
                "Başarı, her gün küçük adımlar atmakla başlar. Sen bunu yapabilirsin!"
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step === 2 && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setStep(1)}
          >
            <Text style={styles.backButtonText}>Geri</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[
            styles.nextButton,
            (step === 1 && !selectedAddiction) && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={step === 1 && !selectedAddiction}
        >
          <Text style={styles.nextButtonText}>
            {step === 2 ? "Başla" : "İleri"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  addictionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  addictionCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  addictionName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  addictionDesc: {
    fontSize: 14,
    color: "#666",
  },
  goalContainer: {
    alignItems: "center",
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  goalOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  goalCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedGoal: {
    backgroundColor: "#4CAF50",
  },
  goalDays: {
    fontSize: 24,
    fontWeight: "bold",
  },
  goalLabel: {
    fontSize: 16,
    color: "#666",
  },
  selectedGoalText: {
    color: "#fff",
  },
  motivationBox: {
    backgroundColor: "#E3F2FD",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    width: "100%",
  },
  motivationText: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    color: "#1565C0",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    flex: 1,
    alignItems: "center",
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: "#A5D6A7",
  },
  nextButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});