import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/appStore";
import { formatDistanceToNow } from "@/utils/dateUtils";
import { calculateSavings } from "@/utils/savingsCalculator";
import { AlertTriangle, TrendingUp, DollarSign, Award } from "lucide-react-native";
import { ADDICTION_TYPES } from "@/constants/addictions";
import { MOTIVATIONAL_QUOTES } from "@/constants/quotes";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const router = useRouter();
  const { 
    addictionType, 
    startDate, 
    goalDays,
    dailyAmount,
    dailyCost,
    setDailyAmount,
    setDailyCost
  } = useAppStore();
  
  const [quote, setQuote] = useState("");
  
  useEffect(() => {
    // Set default values if not set
    if (!dailyAmount) {
      const defaultAmount = addictionType === "sigara" ? 20 : 
                           addictionType === "alkol" ? 3 : 
                           addictionType === "kafein" ? 4 : 1;
      setDailyAmount(defaultAmount);
    }
    
    if (!dailyCost) {
      const defaultCost = addictionType === "sigara" ? 40 : 
                         addictionType === "alkol" ? 150 : 
                         addictionType === "kafein" ? 60 : 
                         addictionType === "kumar" ? 200 : 30;
      setDailyCost(defaultCost);
    }
    
    // Set random motivational quote
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  }, []);
  
  const addiction = ADDICTION_TYPES.find(a => a.id === addictionType) || ADDICTION_TYPES[0];
  const daysPassed = Math.floor((new Date().getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24));
  const progress = Math.min(daysPassed / goalDays, 1);
  const savings = calculateSavings(daysPassed, dailyCost);
  
  const handleEmergencyPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    router.push("/emergency");
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.scrollView}>
        <LinearGradient
          colors={["#4CAF50", "#2E7D32"]}
          style={styles.header}
        >
          <Text style={styles.greeting}>Merhaba!</Text>
          <Text style={styles.streakText}>
            {daysPassed} gündür {addiction.name.toLowerCase()} kullanmıyorsun!
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progress * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {goalDays} günlük hedefe {Math.max(0, goalDays - daysPassed)} gün kaldı
            </Text>
          </View>
        </LinearGradient>
        
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={handleEmergencyPress}
        >
          <AlertTriangle size={24} color="#fff" />
          <Text style={styles.emergencyText}>Kriz Anı Desteği</Text>
        </TouchableOpacity>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{daysPassed}</Text>
            <Text style={styles.statLabel}>Temiz Gün</Text>
          </View>
          
          <View style={styles.statCard}>
            <DollarSign size={24} color="#4CAF50" />
            <Text style={styles.statValue}>{savings} ₺</Text>
            <Text style={styles.statLabel}>Tasarruf</Text>
          </View>
          
          <View style={styles.statCard}>
            <Award size={24} color="#4CAF50" />
            <Text style={styles.statValue}>
              {daysPassed >= 30 ? 3 : daysPassed >= 7 ? 2 : daysPassed >= 1 ? 1 : 0}
            </Text>
            <Text style={styles.statLabel}>Rozet</Text>
          </View>
        </View>
        
        <View style={styles.motivationCard}>
          <Text style={styles.motivationTitle}>Günün Motivasyonu</Text>
          <Text style={styles.motivationQuote}>{quote}</Text>
        </View>
        
        <View style={styles.healthBenefitsCard}>
          <Text style={styles.healthTitle}>Sağlık Kazanımların</Text>
          {addiction.healthBenefits.slice(0, 3).map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>{benefit.day} gün: {benefit.benefit}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.savingsSuggestionCard}>
          <Text style={styles.savingsTitle}>Biriktirdiğin Parayla</Text>
          <View style={styles.suggestionContainer}>
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }} 
              style={styles.suggestionImage} 
            />
            <Text style={styles.suggestionText}>
              {savings >= 1000 
                ? "Arkadaşlarınla harika bir tatil yapabilirsin!" 
                : savings >= 500 
                ? "Arkadaşlarına güzel bir akşam yemeği ısmarlayabilirsin!" 
                : savings >= 200 
                ? "Kendine yeni bir kıyafet alabilirsin!" 
                : "Kendine güzel bir kitap alabilirsin!"}
            </Text>
          </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 4,
  },
  streakText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  progressText: {
    color: "#fff",
    marginTop: 8,
    textAlign: "center",
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF5252",
    marginHorizontal: 20,
    marginTop: -20,
    padding: 15,
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emergencyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    width: "30%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  motivationCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    margin: 20,
    marginTop: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  motivationQuote: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#444",
    lineHeight: 24,
  },
  healthBenefitsCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2E7D32",
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  benefitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginRight: 10,
  },
  benefitText: {
    fontSize: 14,
    color: "#444",
    flex: 1,
  },
  savingsSuggestionCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  savingsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  suggestionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  suggestionImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  suggestionText: {
    fontSize: 16,
    color: "#444",
    flex: 1,
  },
});