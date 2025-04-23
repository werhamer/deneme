import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "@/store/appStore";
import { ADDICTION_TYPES } from "@/constants/addictions";
import { calculateSavings } from "@/utils/savingsCalculator";
import { Calendar, ChevronLeft, ChevronRight, Award } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function ProgressScreen() {
  const router = useRouter();
  const { addictionType, startDate, goalDays, dailyCost } = useAppStore();
  const [selectedTab, setSelectedTab] = useState("calendar");
  
  const addiction = ADDICTION_TYPES.find(a => a.id === addictionType) || ADDICTION_TYPES[0];
  const startDateObj = new Date(startDate);
  const currentDate = new Date();
  const daysPassed = Math.floor((currentDate.getTime() - startDateObj.getTime()) / (1000 * 3600 * 24));
  
  const milestones = [
    { id: 1, days: 1, title: "İlk Gün", description: "Büyük bir adım attın!", achieved: daysPassed >= 1 },
    { id: 2, days: 3, title: "3 Gün", description: "En zor kısmı geçtin!", achieved: daysPassed >= 3 },
    { id: 3, days: 7, title: "1 Hafta", description: "Bir haftayı tamamladın!", achieved: daysPassed >= 7 },
    { id: 4, days: 14, title: "2 Hafta", description: "İki hafta oldu, devam et!", achieved: daysPassed >= 14 },
    { id: 5, days: 30, title: "1 Ay", description: "Bir ay! İnanılmaz başarı!", achieved: daysPassed >= 30 },
    { id: 6, days: 90, title: "3 Ay", description: "Üç ay temiz! Gurur duy!", achieved: daysPassed >= 90 },
    { id: 7, days: 180, title: "6 Ay", description: "Yarım yıl oldu!", achieved: daysPassed >= 180 },
    { id: 8, days: 365, title: "1 Yıl", description: "Bir yıl! Efsanesin!", achieved: daysPassed >= 365 },
  ];
  
  // Generate calendar days for the current month
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const monthNames = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    
    const dayNames = ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"];
    
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.toDateString() === new Date().toDateString();
      const isAfterStart = date >= startDateObj;
      const isBeforeToday = date <= currentDate;
      const isCleanDay = isAfterStart && isBeforeToday;
      
      days.push(
        <View 
          key={`day-${i}`} 
          style={[
            styles.calendarDay,
            isToday && styles.today,
            isCleanDay && styles.cleanDay
          ]}
        >
          <Text style={[
            styles.calendarDayText,
            isToday && styles.todayText,
            isCleanDay && styles.cleanDayText
          ]}>
            {i}
          </Text>
        </View>
      );
    }
    
    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity 
            onPress={() => setCurrentMonth(new Date(year, month - 1, 1))}
            style={styles.calendarArrow}
          >
            <ChevronLeft size={24} color="#4CAF50" />
          </TouchableOpacity>
          
          <Text style={styles.calendarMonthYear}>
            {monthNames[month]} {year}
          </Text>
          
          <TouchableOpacity 
            onPress={() => setCurrentMonth(new Date(year, month + 1, 1))}
            style={styles.calendarArrow}
          >
            <ChevronRight size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.calendarDayNames}>
          {dayNames.map((day, index) => (
            <Text key={index} style={styles.calendarDayName}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.calendarGrid}>
          {days}
        </View>
      </View>
    );
  };
  
  const renderMilestones = () => {
    return (
      <View style={styles.milestonesContainer}>
        {milestones.map((milestone) => (
          <TouchableOpacity
            key={milestone.id}
            style={[
              styles.milestoneCard,
              milestone.achieved && styles.achievedMilestone
            ]}
            onPress={() => {
              if (milestone.achieved) {
                router.push(`/milestone/${milestone.id}`);
              }
            }}
            disabled={!milestone.achieved}
          >
            <View style={styles.milestoneHeader}>
              <Text style={[
                styles.milestoneDays,
                milestone.achieved && styles.achievedMilestoneText
              ]}>
                {milestone.days} Gün
              </Text>
              
              {milestone.achieved && (
                <Award size={20} color="#fff" />
              )}
            </View>
            
            <Text style={[
              styles.milestoneTitle,
              milestone.achieved && styles.achievedMilestoneText
            ]}>
              {milestone.title}
            </Text>
            
            <Text style={[
              styles.milestoneDescription,
              milestone.achieved && styles.achievedMilestoneDescription
            ]}>
              {milestone.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  const renderStats = () => {
    const savings = calculateSavings(daysPassed, dailyCost);
    const notConsumed = daysPassed * (addiction.dailyAmount || 1);
    
    let healthBenefit = "";
    for (let i = addiction.healthBenefits.length - 1; i >= 0; i--) {
      if (daysPassed >= addiction.healthBenefits[i].day) {
        healthBenefit = addiction.healthBenefits[i].benefit;
        break;
      }
    }
    
    return (
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Toplam Tasarruf</Text>
          <Text style={styles.statValue}>{savings} ₺</Text>
          <Text style={styles.statDescription}>
            Bu parayla {savings >= 1000 ? "bir tatil" : savings >= 500 ? "güzel bir akşam yemeği" : "yeni bir kıyafet"} için bütçe ayırabilirsin.
          </Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Tüketmediğin Miktar</Text>
          <Text style={styles.statValue}>{notConsumed} {addiction.unit}</Text>
          <Text style={styles.statDescription}>
            {addiction.id === "sigara" 
              ? `Bu, yaklaşık ${Math.round(notConsumed / 20)} paket sigara demek.` 
              : addiction.id === "alkol" 
              ? `Bu, yaklaşık ${Math.round(notConsumed / 6)} şişe içki demek.` 
              : `Bu miktar ${addiction.name.toLowerCase()} tüketmedin.`}
          </Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Sağlık Kazanımı</Text>
          <Text style={styles.statDescription}>
            {healthBenefit || "Henüz belirgin bir sağlık kazanımı yok, ama her gün daha iyiye gidiyorsun!"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "calendar" && styles.activeTab]}
          onPress={() => setSelectedTab("calendar")}
        >
          <Text style={[styles.tabText, selectedTab === "calendar" && styles.activeTabText]}>
            Takvim
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === "milestones" && styles.activeTab]}
          onPress={() => setSelectedTab("milestones")}
        >
          <Text style={[styles.tabText, selectedTab === "milestones" && styles.activeTabText]}>
            Kilometre Taşları
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === "stats" && styles.activeTab]}
          onPress={() => setSelectedTab("stats")}
        >
          <Text style={[styles.tabText, selectedTab === "stats" && styles.activeTabText]}>
            İstatistikler
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {selectedTab === "calendar" && renderCalendar()}
        {selectedTab === "milestones" && renderMilestones()}
        {selectedTab === "stats" && renderStats()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4CAF50",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  calendarArrow: {
    padding: 5,
  },
  calendarMonthYear: {
    fontSize: 18,
    fontWeight: "bold",
  },
  calendarDayNames: {
    flexDirection: "row",
    marginBottom: 10,
  },
  calendarDayName: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    color: "#666",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  calendarDayText: {
    fontSize: 16,
  },
  today: {
    backgroundColor: "#E8F5E9",
    borderRadius: 20,
  },
  todayText: {
    fontWeight: "bold",
  },
  cleanDay: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
  },
  cleanDayText: {
    color: "#fff",
    fontWeight: "bold",
  },
  milestonesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  milestoneCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  achievedMilestone: {
    backgroundColor: "#4CAF50",
  },
  milestoneHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  milestoneDays: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  milestoneTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  milestoneDescription: {
    fontSize: 14,
    color: "#666",
  },
  achievedMilestoneText: {
    color: "#fff",
  },
  achievedMilestoneDescription: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  statsContainer: {
    gap: 15,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  statDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});