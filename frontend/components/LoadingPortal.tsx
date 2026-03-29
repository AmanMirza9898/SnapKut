import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Animated, 
  Image, 
  Text,
  Dimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface LoadingPortalProps {
  message?: string;
  theme?: 'dark' | 'light';
}

export default function LoadingPortal({ message = "RADIANT SYNC", theme = 'dark' }: LoadingPortalProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#050A0F' : '#F8F9FA';
  const textColor = isDark ? '#FFFFFF' : '#0D1B2A';

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View pointerEvents="none" style={[styles.container, { backgroundColor: bgColor }]}>
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
        <Image 
          source={require('../assets/branding/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <View style={styles.footer}>
         <Text style={[styles.message, { color: textColor }]}>{message.toUpperCase()}</Text>
         <View style={styles.loaderLine}>
            <LinearGradient
               colors={['#58CCFF', '#A044FF']}
               start={{ x: 0, y: 0.5 }}
               end={{ x: 1, y: 0.5 }}
               style={styles.gradientLine}
            />
         </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  logoContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  message: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 4,
    marginBottom: 15,
    opacity: 0.4,
  },
  loaderLine: {
    width: 120,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  gradientLine: {
    width: '100%',
    height: '100%',
  }
});
