import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppStore } from "@/store/appStore";
import { ADDICTION_TYPES } from "@/constants/addictions";
import { calculateSavings } from "@/utils/savingsCalculator";
import { Share2, Award } from "lucide-react-native";
import * as Haptics from "expo-haptics";

export default function MilestoneScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addictionType, startDate, dailyCost } = useAppStore();
  
  const milestoneId = parseInt(id as string);
  const addiction = ADDICTION_TYPES.find(a => a.id === addictionType) || ADDICTION_TYPES[0];
  
  const milestones = [
    { id: 1, days: 1, title: "İlk Gün", description: "Büyük bir adım attın!", image: "https://images.unsplash.com/photo-1531686264889-56fdcabd163f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 2, days: 3, title: "3 Gün", description: "En zor kısmı geçtin!", image: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 3, days: 7, title: "1 Hafta", description: "Bir haftayı tamamladın!", image: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 4, days: 14, title: "2 Hafta", description: "İki hafta oldu, devam et!", image: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 5, days: 30, title: "1 Ay", description: "Bir ay! İnanılmaz başarı!", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 6, days: 90, title: "3 Ay", description: "Üç ay temiz! Gurur duy!", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 7, days: 180, title: "6 Ay", description: "Yarım yıl oldu!", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 8, days: 365, title: "1 Yıl", description: "Bir yıl! Efsanesin!", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
  ];
  
  const milestone = milestones.find(m => m.id === milestoneId) || milestones[0];
  const savings = calculateSavings(milestone.days, dailyCost);
  
  const handleShare = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    // Share functionality would go here
    alert(`${milestone.days} gündür ${addiction.name.toLowerCase()} kullanmıyorum! #BağımlılıklarındanKurtul`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.content}>
        <Image 
          source={{ uri: milestone.image }} 
          style={styles.milestoneImage} 
        />
        
        <View style={styles.milestoneInfo}>
          <View style={styles.badgeContainer}>
            <Award size={32} color="#4CAF50" />
          </View>
          
          <Text style={styles.milestoneTitle}>{milestone.title}</Text>
          <Text style={styles.milestoneDescription}>{milestone.description}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{milestone.days}</Text>
              <Text style={styles.statLabel}>Gün</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{savings}</Text>
              <Text style={styles.statLabel}>₺ Tasarruf</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{milestone.days * (addiction.dailyAmount || 1)}</Text>
              <Text style={styles.statLabel}>{addiction.unit}</Text>
            </View>
          </View>
          
          <View style={styles.messageContainer}>
            <Text style={styles.messageTitle}>Tebrikler!</Text>
            <Text style={styles.messageText}>
              {milestone.days} gündür {addiction.name.toLowerCase()} kullanmıyorsun. Bu inanılmaz bir başarı! Kendini ödüllendirmeyi unutma.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Share2 size={20} color="#fff" />
            <Text style={styles.shareButtonText}>Başarını Paylaş</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => router.back()}
          >
            <Text style={styles.continueButtonText}>Devam Et</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  milestoneImage: {
    width: "100%",
    height: 200,
  },
  milestoneInfo: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  badgeContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -35,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  milestoneTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  milestoneDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  messageContainer: {
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    marginBottom: 30,
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 10,
    textAlign: "center",
  },
  messageText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    textAlign: "center",
  },
  shareButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  shareButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  continueButton: {
    paddingVertical: 12,
  },
  continueButtonText: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 16,
  },
});