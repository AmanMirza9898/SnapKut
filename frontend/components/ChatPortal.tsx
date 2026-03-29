import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  ActivityIndicator, 
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface ChatPortalProps {
  uri: string;
  platform: string;
  username: string;
  onClose?: () => void;
  color: string;
  theme: 'dark' | 'light';
  linkId: string; 
}

const DESKTOP_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36";
const MOBILE_UA = "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36";
const TABLET_UA = "Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1";

export default function ChatPortal({ uri, platform, username, onClose, color, theme, linkId }: ChatPortalProps) {
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(true);
  const [hasInitialSynced, setHasInitialSynced] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const isDark = theme === 'dark';
  const themeBg = isDark ? '#050A0F' : '#f8f9fa';
  const themeText = isDark ? '#fff' : '#0D1B2A';

  // Radiant Pulse Effect for Loader
  useEffect(() => {
    if (loading || isSyncing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [loading, isSyncing]);

  useEffect(() => {
    // Safety timeout to clear loader if discovery fails
    if (!hasInitialSynced) {
      const timer = setTimeout(() => {
        setIsSyncing(false);
        setLoading(false);
        setHasInitialSynced(true);
      }, 6000); 
      return () => clearTimeout(timer);
    }
  }, [uri, hasInitialSynced]);

  const isWhatsApp = platform.toLowerCase() === 'whatsapp';
  const isFacebook = platform.toLowerCase() === 'facebook';
  const userAgent = isFacebook ? TABLET_UA : (isWhatsApp ? DESKTOP_UA : MOBILE_UA);

  const smartScript = `
    (function() {
      const style = document.createElement('style');
      style.innerHTML = 'body { background-color: ${themeBg} !important; color: ${themeText} !important; }';
      document.head.appendChild(style);

      if (window.location.href.includes('instagram.com')) {
         const hideNav = () => {
           const nav = document.querySelector('nav');
           if (nav) nav.style.display = 'none';
           const banners = Array.from(document.querySelectorAll('div')).filter(d => d.innerText && d.innerText.includes('App'));
           banners.forEach(b => b.style.display = 'none');
           const headers = document.querySelectorAll('header');
           headers.forEach(h => h.style.display = 'none');
         };
         hideNav();
         setInterval(hideNav, 2000); 

         const trySync = () => {
            const url = window.location.href;
            const isIG = url.includes('instagram.com/');
            if (isIG) {
               const path = window.location.pathname.split('/').filter(Boolean);
               // SYNC: Inbox, Threads (DMs)
               if (url.includes('direct/t/') || url.includes('direct/inbox/')) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SYNCED' }));
                  return;
               }
               // SYNC: Explore, Reels, OR ANY User Profile (path length 1)
               if (url.includes('/reels/') || url.includes('/explore/') || path.length === 1) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SYNCED', browsing: true }));
                  return;
               }
            }
         };
         trySync();
         setInterval(trySync, 2000); // V51: FASTER SYNC
      }

      if (window.location.href.includes('facebook.com')) {
         const hideBanners = () => {
           const appLink = document.querySelector('a[href*="facebook.com/mobile"]');
           if (appLink) appLink.style.display = 'none';
         };
         hideBanners();
         setInterval(hideBanners, 5000); 
      }
      true;
    })();
  `;

  const onMessage = (event: any) => {
     try {
       const data = JSON.parse(event.nativeEvent.data);
       if (data.type === 'SYNCED') {
         setIsSyncing(false);
         setLoading(false);
         setHasInitialSynced(true);
       }
     } catch (e) {}
  };

  return (
    <View style={[styles.container, { backgroundColor: themeBg }]}>
      {/* V52: ONLY SHOW BLOCKING LOADER FOR INITIAL SYNC */}
      {!hasInitialSynced && (loading || isSyncing) && (
        <View style={[styles.loadingOverlay, { backgroundColor: themeBg }]}>
          <Animated.View style={[styles.logoPulse, { transform: [{ scale: pulseAnim }] }]}>
            <Image source={require('../assets/branding/logo.png')} style={styles.logoImage} />
          </Animated.View>
          <ActivityIndicator size="small" color="#58CCFF" style={{ marginTop: 20 }} />
          <Text style={[styles.loadingText, { color: isDark ? '#fff' : '#0D1B2A' }]}>TERMINAL SYNCING...</Text>
          <Text style={styles.platformText}>LOCATING @{username.toUpperCase()}</Text>
        </View>
      )}

      <View style={[styles.portalHeader, { backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.8)', borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
         <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => webViewRef.current?.goBack()} style={[styles.navBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
               <Ionicons name="chevron-back" size={20} color={themeText} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => webViewRef.current?.reload()} style={[styles.navBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
               <Ionicons name="refresh" size={20} color={themeText} />
            </TouchableOpacity>
         </View>
         <View style={styles.headerCenter}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
               <Text style={[styles.portalPlatform, { color: themeText }]}>{platform.toUpperCase()}</Text>
               {loading && hasInitialSynced && <ActivityIndicator size="small" color="#58CCFF" />}
            </View>
            <Text style={[styles.portalUser, { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }]}>@{username.toLowerCase()}</Text>
         </View>
         <View style={styles.headerRight}>
            <TouchableOpacity onPress={onClose} style={[styles.navBtn, { backgroundColor: 'rgba(255,59,48,0.1)' }]}>
               <Ionicons name="close" size={20} color="#ff3b30" />
            </TouchableOpacity>
         </View>
      </View>

      <WebView
        key={linkId}
        ref={webViewRef}
        source={{ uri }}
        style={[styles.webview, { backgroundColor: themeBg }, (!hasInitialSynced && (loading || isSyncing)) && { opacity: 0 }]}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => {
          setLoading(false);
          // V51: RESTORE SMOOTH FLOW (No delay)
          if (hasInitialSynced) {
             setIsSyncing(false);
          }
        }}
        userAgent={userAgent}
        injectedJavaScript={smartScript}
        onMessage={onMessage}
        domStorageEnabled={true}
        cacheEnabled={true}
        javaScriptEnabled={true}
        androidLayerType="hardware"
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  portalHeader: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, borderBottomWidth: 1 },
  headerLeft: { flexDirection: 'row', gap: 8, flex: 1 },
  headerCenter: { flex: 1.5, alignItems: 'center' },
  headerRight: { flex: 1, alignItems: 'flex-end' },
  navBtn: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  portalPlatform: { fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  portalUser: { fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  webview: { flex: 1 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  logoPulse: { width: 120, height: 120, justifyContent: 'center', alignItems: 'center' },
  logoImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  loadingText: { marginTop: 15, fontSize: 10, fontWeight: '900', letterSpacing: 3, opacity: 0.6 },
  platformText: { marginTop: 8, color: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: '800' }
});
