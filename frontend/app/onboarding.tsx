import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions, 
  Animated,
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          })
        ])
      )
    ]).start();
  }, [fadeAnim, slideAnim, pulseAnim]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={['#050A0F', '#0D1B2A', '#050A0F']}
        style={styles.background}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          
          {/* RADIANT HERO SECTION */}
          <View style={styles.heroSection}>
            <Animated.View style={[styles.logoWrapper, { transform: [{ scale: pulseAnim }] }]}>
               <Image 
                 source={require('../assets/branding/logo.png')} 
                 style={styles.logo}
                 resizeMode="contain"
               />
               <View style={styles.logoRing} />
            </Animated.View>
            
            <View style={styles.brandHeader}>
              <Text style={styles.brandTitle}>SHORTKUT</Text>
              <View style={styles.titleUnderline}>
                <LinearGradient
                  colors={['#58CCFF', '#A044FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientLine}
                />
              </View>
            </View>
          </View>

          {/* VALUE PROP SECTION */}
          <View style={styles.valueProp}>
            <Text style={styles.headline}>Your Messaging Hub,{"\n"}<Text style={styles.highlight}>Accelerated.</Text></Text>
            <Text style={styles.subheadline}>Connect all your social portals in one high-velocity terminal. No bloat. Pure speed.</Text>
          </View>

          {/* ACTION SECTION */}
          <View style={styles.footer}>
            <TouchableOpacity 
              activeOpacity={0.8}
              style={styles.primaryBtn}
              onPress={() => router.push('/register')}
            >
              <LinearGradient
                colors={['#58CCFF', '#A044FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGradient}
              >
                <Text style={styles.primaryBtnText}>GET STARTED</Text>
                <Ionicons name="flash" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.7}
              style={styles.secondaryBtn}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.secondaryBtnText}>LOG IN TO ACCOUNT</Text>
            </TouchableOpacity>

            <Text style={styles.terms}>
              By joining, you agree to our <Text style={styles.link}>Terms</Text> and <Text style={styles.link}>Privacy</Text>
            </Text>
          </View>

        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { ...StyleSheet.absoluteFillObject },
  safeArea: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 30, justifyContent: 'space-between', paddingVertical: 40 },
  heroSection: { alignItems: 'center', marginTop: height * 0.05 },
  logoWrapper: { width: 140, height: 140, justifyContent: 'center', alignItems: 'center' },
  logo: { width: '100%', height: '100%' },
  logoRing: { position: 'absolute', width: 180, height: 180, borderRadius: 90, borderWidth: 1, borderColor: 'rgba(88, 204, 255, 0.1)', borderStyle: 'dashed' },
  brandHeader: { alignItems: 'center', marginTop: 25 },
  brandTitle: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: 8 },
  titleUnderline: { width: 60, height: 4, marginTop: 8, borderRadius: 2, overflow: 'hidden' },
  gradientLine: { flex: 1 },
  valueProp: { alignItems: 'center' },
  headline: { fontSize: 36, fontWeight: '900', color: '#fff', textAlign: 'center', lineHeight: 44 },
  highlight: { color: '#58CCFF' },
  subheadline: { fontSize: 16, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 15, lineHeight: 24, paddingHorizontal: 20 },
  footer: { gap: 18 },
  primaryBtn: { height: 64, borderRadius: 20, overflow: 'hidden', shadowColor: '#A044FF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
  btnGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  secondaryBtn: { height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  secondaryBtnText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  terms: { fontSize: 10, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 10 },
  link: { color: '#58CCFF', textDecorationLine: 'underline' }
});
