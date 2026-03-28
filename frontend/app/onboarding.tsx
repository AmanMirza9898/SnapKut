import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#000000']}
        style={styles.background}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <MaterialCommunityIcons name="reply-all" size={40} color="#3dfc3d" style={styles.logoIcon} />
            </View>
            <Ionicons name="chatbubble-ellipses" size={24} color="#3dfc3d" style={styles.floatingChatIcon} />
          </View>

          {/* Title Section */}
          <View style={styles.header}>
            <Text style={styles.title}>SnapKut</Text>
            <Text style={styles.subtitle}>Your Social Inbox,{"\n"}Simplified.</Text>
            <Text style={styles.caption}>ONE TAP TO ANY DM.</Text>
          </View>

          {/* Center Card */}
          <View style={styles.cardContainer}>
            <Ionicons name="at-circle" size={32} color="#4b5563" style={styles.atIcon} />
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={18} color="#fff" />
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg} />
                  <View style={styles.progressBarActive} />
                </View>
                <View style={styles.flashIcon}>
                   <Ionicons name="flash" size={14} color="#3dfc3d" />
                </View>
              </View>
              <View style={styles.cardFooter}>
                 <View style={styles.smallAvatars}>
                    <View style={[styles.smallAvatar, {zIndex: 3}]} />
                    <View style={[styles.smallAvatar, {zIndex: 2, marginLeft: -10}]} />
                    <View style={[styles.smallAvatar, {zIndex: 1, marginLeft: -10}]} />
                 </View>
                 <Text style={styles.messageCount}>+12 MESSAGES</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.getStartedBtn}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginBtn}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginText}>LOG IN TO ACCOUNT</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By continuing, you agree to our <Text style={styles.link}>Terms of Service</Text>{"\n"}
              and <Text style={styles.link}>Privacy Policy</Text>.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-10deg' }],
    borderWidth: 1,
    borderColor: '#334155',
  },
  logoIcon: {
    transform: [{ rotate: '10deg' }],
  },
  floatingChatIcon: {
    position: 'absolute',
    right: width * 0.2,
    top: 50,
    opacity: 0.6,
  },
  header: {
    alignItems: 'center',
    marginTop: -20,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    fontStyle: 'italic',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 34,
  },
  caption: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 15,
    letterSpacing: 1,
  },
  cardContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  atIcon: {
    position: 'absolute',
    left: 20,
    top: -10,
    zIndex: 10,
    opacity: 0.5,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    height: 8,
    marginHorizontal: 15,
    justifyContent: 'center',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#0f172a',
    borderRadius: 3,
    width: '80%',
  },
  progressBarActive: {
    height: 4,
    backgroundColor: '#1e293b',
    borderRadius: 2,
    width: '40%',
    position: 'absolute',
    top: 1,
  },
  flashIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(61, 252, 61, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
  },
  smallAvatars: {
    flexDirection: 'row',
  },
  smallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#334155',
  },
  messageCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
  },
  footer: {
    gap: 15,
  },
  getStartedBtn: {
    backgroundColor: '#3dfc3d',
    height: 64,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#3dfc3d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  getStartedText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000',
  },
  loginBtn: {
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderStyle: 'dashed',
  },
  loginText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  termsText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 10,
  },
  link: {
    color: '#3dfc3d',
    fontWeight: '600',
  },
});
