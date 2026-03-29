import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform as DevicePlatform,
  ActivityIndicator,
  Dimensions,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Feather, 
  MaterialCommunityIcons, 
  Ionicons 
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/Config';
import CustomAlert from '../../components/CustomAlert';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

const PLATFORMS = [
  { 
    id: 'Instagram', 
    label: 'INSTAGRAM', 
    color: '#E1306C', 
    localImage: require('../../assets/branding/instagram.png'),
    loginUri: () => `https://www.instagram.com/accounts/login/`
  },
  { 
    id: 'Facebook', 
    label: 'FACEBOOK', 
    color: '#1877F2', 
    localImage: require('../../assets/branding/facebook.png'),
    loginUri: () => `https://m.facebook.com/login/`
  },
  { 
    id: 'Discord', 
    label: 'DISCORD', 
    color: '#5865F2', 
    localImage: require('../../assets/branding/discord.png'),
    loginUri: () => `https://discord.com/login`
  },
  { 
    id: 'Twitter', 
    label: 'TWITTER', 
    color: '#ffffff', 
    localImage: require('../../assets/branding/twitter.png'),
    loginUri: () => `https://x.com/i/flow/login`
  },
];

export default function MobileAddShortcut() {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [selectedPlatform, setSelectedPlatform] = useState('Instagram');
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState<any>({ visible: false, type: 'info', title: '', message: '' });

  const currentPlatform = PLATFORMS.find(p => p.id === selectedPlatform) || PLATFORMS[0];

  const showAlert = (type: any, title: string, message: string) => {
    setAlertConfig({ visible: true, type, title, message });
  };

  const handlePlatformSelect = (id: string) => {
    setSelectedPlatform(id);
    setIsLoginMode(true);
  };

  const handleAutoSave = async (detectedUser: string) => {
    if (loading) return;
    setLoading(true);
    
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/onboarding');
        return;
      }

      console.log(`Auto-saving ${selectedPlatform} for @${detectedUser}...`);
      
      const response = await fetch(`${API_URL}/links/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          platform: selectedPlatform,
          username: detectedUser
        })
      });

      if (response.ok) {
        // SUCCESS: Auto-Redirect to Dashboard
        router.replace('/(tabs)');
      } else {
        const data = await response.json();
        showAlert('error', 'Sync Failed', data.error || 'Identity captured but unable to save.');
        setLoading(false);
      }
    } catch (error) {
       console.error(error);
       setLoading(false);
    }
  };

  // Discovery Script (Version 2.8 - Hyper-Aggressive Sync)
  const discoveryScript = `
    (function() {
      const scan = () => {
        let username = null;
        const url = window.location.href;
        
        // Matches instagram.com/username/ 
        if (url.includes('instagram.com/')) {
           const path = window.location.pathname.split('/').filter(Boolean);
           if (path.length === 1 && !['explore', 'reels', 'direct', 'accounts', 'stories', 'p', 'tv'].includes(path[0])) {
              username = path[0];
           }
        }

        if (!username && url.includes('instagram.com')) {
           if (window._sharedData?.config?.viewer?.username) {
              username = window._sharedData.config.viewer.username;
           }
        }
        
        if (url.includes('facebook.com') && !url.includes('login') && !url.includes('checkpoint')) {
           username = "FB_User";
        }

        if (username) {
           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'DISCOVERY', username }));
        }
      };
      
      setInterval(scan, 700);
      true;
    })();
  `;

  const onMessage = (event: any) => {
     try {
       const data = JSON.parse(event.nativeEvent.data);
       if (data.type === 'DISCOVERY') {
         handleAutoSave(data.username);
       }
     } catch (e) {}
  };

  // SUCCESS DETECTION FAIL-SAFE
  const handleNavStateChange = (navState: any) => {
     const { url } = navState;
     // If we reach a non-login page, it's a success
     if (selectedPlatform === 'Instagram' && (url.includes('instagram.com/') && !url.includes('login') && !url.includes('accounts'))) {
         // Auto-save with fallback if discovery is still pending
         setTimeout(() => handleAutoSave('SyncUser'), 2000);
     }
     if (selectedPlatform === 'Facebook' && (url.includes('facebook.com/home') || url.includes('facebook.com/feed'))) {
         handleAutoSave('FB_Synced');
     }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={DevicePlatform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => isLoginMode ? setIsLoginMode(false) : router.back()} style={styles.headerAction}>
              <Feather name={isLoginMode ? "arrow-left" : "chevron-left"} size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{isLoginMode ? 'SECURE SYNC' : 'ADD ACCOUNT'}</Text>
            <View style={{ width: 44 }} />
          </View>

          {isLoginMode ? (
            <View style={styles.loginContainer}>
               <View style={styles.webviewWrapper}>
                  {loading ? (
                    <View style={styles.loadingOverlay}>
                       <ActivityIndicator size="large" color={currentPlatform.color} />
                       <Text style={[styles.syncText, { color: currentPlatform.color }]}>PREPARING DASHBOARD...</Text>
                       <Text style={styles.redirectHint}>Syncing shortcut with your home hub.</Text>
                    </View>
                  ) : (
                    <WebView 
                      ref={webViewRef}
                      source={{ uri: currentPlatform.loginUri() }}
                      style={{ flex: 1, backgroundColor: '#000' }}
                      userAgent="Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36"
                      injectedJavaScript={discoveryScript}
                      onMessage={onMessage}
                      onNavigationStateChange={handleNavStateChange}
                      domStorageEnabled={true}
                      javaScriptEnabled={true}
                    />
                  )}
               </View>

               <View style={styles.tipBox}>
                  <Ionicons name="sparkles" size={16} color="#39FF14" />
                  <Text style={styles.tipText}>Log in and we'll handle the rest. Redirecting automatically.</Text>
               </View>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.scrollContent}>
               <View style={styles.modalCard}>
                  <Text style={styles.modalHeading}>PICK PLATFORM</Text>
                  
                  <View style={styles.platformGrid}>
                     {PLATFORMS.map((platform) => (
                        <TouchableOpacity 
                          key={platform.id}
                          onPress={() => handlePlatformSelect(platform.id)}
                          style={styles.platformItem}
                        >
                           <View style={styles.iconCircle}>
                              <Image source={platform.localImage} style={styles.platformIcon} />
                           </View>
                           <Text style={styles.platformLabel}>{platform.id}</Text>
                        </TouchableOpacity>
                     ))}
                  </View>
               </View>
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>

      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerAction: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  modalCard: {
    backgroundColor: '#050505',
    borderRadius: 40,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  modalHeading: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 40,
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 25,
    marginBottom: 40,
  },
  platformItem: {
    alignItems: 'center',
    gap: 12,
    width: (width - 150) / 2,
  },
  iconCircle: {
     width: 84,
     height: 84,
     borderRadius: 24,
     backgroundColor: 'rgba(255,255,255,0.02)',
     borderWidth: 1,
     borderColor: 'rgba(255,255,255,0.05)',
     justifyContent: 'center',
     alignItems: 'center',
  },
  platformIcon: {
    width: 54,
    height: 54,
    borderRadius: 12,
  },
  platformLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  loginContainer: {
    flex: 1,
    padding: 20,
  },
  webviewWrapper: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 20,
    backgroundColor: '#000',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  syncText: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  redirectHint: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 10,
    marginTop: 10,
    fontWeight: '700',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 15,
    borderRadius: 15,
  },
  tipText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    fontWeight: '700',
    flex: 1,
  }
});
