import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#121212']}
        style={styles.background}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuBtn}>
             <MaterialCommunityIcons name="menu" size={28} color="#3dfc3d" />
          </TouchableOpacity>
          
          <Text style={styles.logoText}>SnapKut</Text>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.logoutBtn}>
               <View style={styles.dashedCircle}>
                  <Feather name="log-out" size={20} color="#94a3b8" />
               </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileBtn}>
                <View style={styles.avatarPlaceholder}>
                   <Ionicons name="person" size={20} color="#fff" />
                </View>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome back, User!</Text>
            <Text style={styles.welcomeSubtitle}>Ready to streamline your social workflow?</Text>
          </View>

          {/* Empty State Card */}
          <View style={styles.emptyStateCard}>
            <View style={styles.dashedCardBorder}>
              <TouchableOpacity style={styles.addShortcutBtn}>
                <View style={styles.dashedSquare}>
                   <View style={styles.plusCircle}>
                      <Ionicons name="add" size={28} color="#000" />
                   </View>
                </View>
              </TouchableOpacity>
              
              <Text style={styles.emptyStateTitle}>No Social Links Added Yet.</Text>
              <Text style={styles.emptyStateSubtitle}>Tap + to add your first DM shortcut.</Text>
            </View>
          </View>

          {/* Feature Cards */}
          <View style={styles.featureRow}>
            <TouchableOpacity style={styles.featureCard}>
               <MaterialCommunityIcons name="chart-timeline-variant" size={24} color="#3dfc3d" />
               <Text style={styles.featureLabel}>ANALYTICS{"\n"}OFFLINE</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.featureCard}>
               <MaterialCommunityIcons name="creation" size={24} color="#3dfc3d" />
               <Text style={styles.featureLabel}>SMART FILTERS</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
  },
  menuBtn: {
    padding: 4,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    fontStyle: 'italic',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutBtn: {
    padding: 2,
  },
  dashedCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1e293b',
  },
  avatarPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#334155',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 100,
  },
  welcomeSection: {
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 8,
    fontWeight: '500',
  },
  emptyStateCard: {
    height: 320,
    marginBottom: 30,
  },
  dashedCardBorder: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderStyle: 'dashed',
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  addShortcutBtn: {
    marginBottom: 30,
  },
  dashedSquare: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  plusCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3dfc3d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 15,
  },
  featureCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 24,
    gap: 15,
  },
  featureLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
    lineHeight: 18,
  },
});
