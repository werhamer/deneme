import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAppStore } from "@/store/appStore";
import { ADDICTION_TYPES } from "@/constants/addictions";
import { EMERGENCY_TIPS } from "@/constants/emergencyTips";
import { BREATHING_EXERCISES } from "@/constants/breathingExercises";
import { Wind, Clock, ArrowRight, X } from "lucide-react-native";
import * as Haptics from "expo-haptics";

export default function EmergencyScreen() {
  const router = useRouter();
  const { addictionType } = useAppStore();
  const [currentExercise, setCurrentExercise] = useState<number | null>(null);
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  
  const addiction = ADDICTION_TYPES.find(a => a.id === addictionType) || ADDICTION_TYPES[0];
  const tips = EMERGENCY_TIPS.filter(tip => 
    tip.addictionTypes.includes(addictionType) || tip.addictionTypes.includes("all")
  );
  
  useEffect(() => {
    if (currentExercise !== null) {
      const exercise = BREATHING_EXERCISES[currentExercise];
      let seconds = 0;
      
      if (breathingPhase === "inhale") {
        seconds = exercise.inhale;
      } else if (breathingPhase === "hold") {
        seconds = exercise.hold;
      } else {
        seconds = exercise.exhale;
      }
      
      setSecondsLeft(seconds);
      
      const timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Move to next phase
            if (breathingPhase === "inhale") {
              setBreathingPhase("hold");
              return exercise.hold;
            } else if (breathingPhase === "hold") {
              setBreathingPhase("exhale");
              return exercise.exhale;
            } else {
              setBreathingPhase("inhale");
              return exercise.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [currentExercise, breathingPhase]);
  
  const handleStartExercise = (index: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setCurrentExercise(index);
    setBreathingPhase("inhale");
    setSecondsLeft(BREATHING_EXERCISES[index].inhale);
  };
  
  const handleStopExercise = () => {
    setCurrentExercise(null);
  };
  
  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % tips.length);
  };

  return (
    <SafeAreaView style={[
      styles.container, 
      currentExercise !== null ? styles.exerciseBackground : {}
    ]} edges={["bottom"]}>
      {currentExercise !== null ? (
        <View style={styles.exerciseContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleStopExercise}
          >
            <X size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.exerciseTitle}>
            {BREATHING_EXERCISES[currentExercise].name}
          </Text>
          
          <View style={styles.breathingCircle}>
            <Text style={styles.breathingPhase}>
              {breathingPhase === "inhale" 
                ? "Nefes Al" 
                : breathingPhase === "hold" 
                ? "Tut" 
                : "Nefes Ver"}
            </Text>
            <Text style={styles.secondsLeft}>{secondsLeft}</Text>
          </View>
          
          <Text style={styles.breathingInstructions}>
            {breathingPhase === "inhale" 
              ? "Burnundan yavaşça nefes al" 
              : breathingPhase === "hold" 
              ? "Nefesinizi tutun" 
              : "Ağzından yavaşça nefes ver"}
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Kriz Anı Desteği</Text>
            <Text style={styles.headerSubtitle}>
              Zorlandığın anlar için hızlı destek
            </Text>
          </View>
          
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipTitle}>Hızlı İpucu</Text>
              <TouchableOpacity onPress={handleNextTip}>
                <ArrowRight size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.tipText}>{tips[tipIndex].tip}</Text>
          </View>
          
          <Text style={styles.sectionTitle}>Nefes Egzersizleri</Text>
          
          {BREATHING_EXERCISES.map((exercise, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exerciseCard}
              onPress={() => handleStartExercise(index)}
            >
              <View style={styles.exerciseIcon}>
                <Wind size={24} color="#fff" />
              </View>
              
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDescription}>
                  {exercise.description}
                </Text>
              </View>
              
              <View style={styles.exerciseTime}>
                <Clock size={16} color="#666" />
                <Text style={styles.exerciseDuration}>
                  {exercise.inhale + exercise.hold + exercise.exhale} sn
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          
          <Text style={styles.sectionTitle}>Alternatif Aktiviteler</Text>
          
          <View style={styles.activitiesContainer}>
            {[
              { name: "Kısa Yürüyüş", image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
              { name: "Su İç", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
              { name: "Müzik Dinle", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
              { name: "Arkadaşını Ara", image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
            ].map((activity, index) => (
              <View key={index} style={styles.activityCard}>
                <Image 
                  source={{ uri: activity.image }} 
                  style={styles.activityImage} 
                />
                <Text style={styles.activityName}>{activity.name}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.motivationCard}>
            <Text style={styles.motivationText}>
              "Bu an geçecek. Her kriz anını atlattığında daha da güçleniyorsun. Sen bunu yapabilirsin!"
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  exerciseBackground: {
    backgroundColor: "#4CAF50",
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF5252",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  tipCard: {
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
  tipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tipText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  exerciseCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  exerciseIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  exerciseDescription: {
    fontSize: 14,
    color: "#666",
  },
  exerciseTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseDuration: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  activitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  activityCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityImage: {
    width: "100%",
    height: 100,
  },
  activityName: {
    fontSize: 16,
    fontWeight: "500",
    padding: 10,
    textAlign: "center",
  },
  motivationCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  motivationText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#2E7D32",
    textAlign: "center",
    lineHeight: 24,
  },
  exerciseContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
  breathingPhase: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  secondsLeft: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  breathingInstructions: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});