import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions, 
  RefreshControl,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { 
  Ionicons, 
  Feather, 
  MaterialCommunityIcons 
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/Config';
import ChatPortal from '../../components/ChatPortal';
import LoadingPortal from '../../components/LoadingPortal'; // V45
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

// V45 RADIANT THEMES
const THEMES: any = {
  dark: {
    bg: '#050A0F',
    card: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.06)',
    text: '#fff',
    subText: 'rgba(255,255,255,0.4)',
    accent: '#58CCFF',
    sidebar: '#050A0F',
    header: '#050A0F',
  },
  light: {
    bg: '#f8f9fa',
    card: '#ffffff',
    border: 'rgba(0,0,0,0.05)',
    text: '#0D1B2A',
    subText: 'rgba(0,0,0,0.5)',
    accent: '#A044FF',
    sidebar: '#ffffff',
    header: '#ffffff',
  }
};

const PLATFORMS_CONFIG: any = {
  instagram: { id: 'Instagram', icon: 'instagram', color: '#E1306C', localImage: require('../../assets/branding/instagram.png'), loginUri: 'https://www.instagram.com/accounts/login/' },
  facebook: { id: 'Facebook', icon: 'facebook', color: '#1877F2', localImage: require('../../assets/branding/facebook.png'), loginUri: 'https://m.facebook.com/login/' },
  discord: { id: 'Discord', icon: 'discord', color: '#5865F2', localImage: require('../../assets/branding/discord.png'), loginUri: 'https://discord.com/login' },
  twitter: { id: 'Twitter', icon: 'twitter', color: '#ffffff', localImage: require('../../assets/branding/twitter.png'), loginUri: 'https://x.com/i/flow/login' },
  linkedin: { id: 'LinkedIn', icon: 'linkedin', color: '#0077B5', localImage: require('../../assets/branding/linkedin.png'), loginUri: 'https://www.linkedin.com/login' }, // V47
  home: { icon: 'home', color: '#58CCFF' }
};

export default function UnifiedDashboard() {
  const router = useRouter();
  
  const [links, setLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activePlatform, setActivePlatform] = useState('home');
  const [activeUri, setActiveUri] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [activeLinkId, setActiveLinkId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false); // V45 TRANSITION GUARD

  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const lastFetchRef = useRef<number>(0); 
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [syncPlatform, setSyncPlatform] = useState<string | null>(null);
  const [pendingPlatform, setPendingPlatform] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const savedT = await AsyncStorage.getItem('themeMode');
        const savedS = await AsyncStorage.getItem('isSidebarHidden');
        if (savedT === 'light' || savedT === 'dark') setThemeMode(savedT);
        setIsSidebarHidden(savedS === 'true');
      })();
    }, [])
  );

  const getDefaultUri = (platform: string) => {
    const p = platform.toLowerCase();
    switch (p) {
      case 'facebook': return 'https://www.facebook.com/messages/';
      case 'instagram': return 'https://www.instagram.com/direct/inbox/';
      case 'whatsapp': return 'https://web.whatsapp.com/';
      case 'discord': return 'https://discord.com/app';
      case 'twitter': return 'https://twitter.com/messages';
      default: return `https://www.${p}.com/`;
    }
  };

  const handlePlatformJump = useCallback((platform: string, linkData: any = null) => {
    if (platform === 'home') {
      setIsAddingMode(false);
      setSyncPlatform(null);
      setPendingPlatform(null);
      setIsSyncing(false); // V46.6: FORCE CLEAR
      setActivePlatform('home');
      setActiveUri(null);
      setActiveUser(null);
      setActiveLinkId(null);
    } else if (platform === 'add_new') {
      setIsAddingMode(true);
      setActivePlatform('add_portal');
      setActiveUri(null);
      setSyncPlatform(null);
      setPendingPlatform(null);
    } else {
      const isSameAccount = activePlatform === platform && activeUser === linkData?.username;
      if (isSameAccount && activeUri) return;

      setIsAddingMode(false);
      setSyncPlatform(null);
      setPendingPlatform(null);
      setActivePlatform(platform);
      setActiveUri(linkData?.uri || getDefaultUri(platform));
      setActiveUser(linkData?.username || '');
      setActiveLinkId(linkData?._id || null);
    }
  }, [activePlatform, activeUser, activeUri]);

  // V45: ZERO-BLACK RADIANT JUMP
  const jumpWithLoading = useCallback((platform: string, linkData: any = null) => {
    setIsTransitioning(true);
    handlePlatformJump(platform, linkData);
    // V46: REDUCED TIMEOUT FOR SNAPPY FEEL
    setTimeout(() => setIsTransitioning(false), 800);
  }, [handlePlatformJump]);

  // V46.6: SYNC WATCHDOG (AUTO-CLEAR STUCK STATES)
  useEffect(() => {
    if (isSyncing) {
      const timer = setTimeout(() => {
        setIsSyncing(false);
        setSyncPlatform(null);
        setPendingPlatform(null);
      }, 15000); 
      return () => clearTimeout(timer);
    }
  }, [isSyncing]);

  const fetchLinks = React.useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && (now - lastFetchRef.current < 30000)) return;
    lastFetchRef.current = now;

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/onboarding');
        return;
      }
      const response = await fetch(`${API_URL}/links/get`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        const newLinks = data.links || [];
        setLinks(newLinks);
        if (activeLinkId && !newLinks.some((l: any) => l._id === activeLinkId)) {
           handlePlatformJump('home');
        }
      }
    } catch (error) {
      console.error('Fetch links error:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [activeLinkId, handlePlatformJump]);

  useFocusEffect(
    React.useCallback(() => {
      fetchLinks(true); // V49: FORCE REFETCH ON FOCUS
    }, [fetchLinks])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchLinks(true);
  };

  const toggleSidebar = async () => {
    const next = !isSidebarHidden;
    setIsSidebarHidden(next);
    await AsyncStorage.setItem('isSidebarHidden', next.toString());
  };

  const handleStartSync = (platformId: string) => {
    setPendingPlatform(platformId);
    setSyncPlatform(platformId);
  };

  const handleAutoSave = async (detectedUser: string) => {
    if (!isAddingMode || !syncPlatform || isSyncing) return;
    const alreadyExists = links.some(l => 
        l.platform.toLowerCase() === syncPlatform.toLowerCase() && 
        l.username.toLowerCase() === detectedUser.toLowerCase()
    );
    if (alreadyExists) {
       setIsAddingMode(false);
       setSyncPlatform(null);
       setPendingPlatform(null);
       return;
    }
    setIsSyncing(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/links/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ platform: syncPlatform, username: detectedUser })
      });
      if (response.ok) {
        // V53.5: INSTANT CLEAR BEFORE FETCH
        setIsAddingMode(false);
        setSyncPlatform(null);
        setPendingPlatform(null);
        setIsSyncing(false);
        await fetchLinks(true);
        setActivePlatform('home');
      }
    } catch (error) {
      console.error(error);
      setIsSyncing(false);
    }
  };

  const discoveryScript = `
    (function() {
      let scanTimer = null;
      const scan = () => {
        let username = null;
        const url = window.location.href;
        // INSTAGRAM
        if (url.includes('instagram.com/')) {
           const path = window.location.pathname.split('/').filter(Boolean);
           if (path.length === 1 && !['explore', 'reels', 'direct', 'accounts', 'stories', 'p', 'tv'].includes(path[0])) {
              username = path[0];
           }
        }
        // FACEBOOK
        if (url.includes('facebook.com') && !url.includes('login') && !url.includes('checkpoint')) {
           username = "FB_User";
        }
        // LINKEDIN (V53)
        if (url.includes('linkedin.com/') && (url.includes('/feed') || url.includes('/in/') || url.includes('/mynetwork') || url.includes('/messaging'))) {
           username = "LinkedIn_User";
        }
        // TWITTER/X (V53)
        if ((url.includes('twitter.com') || url.includes('x.com')) && url.includes('/home')) {
           username = "Twitter_User";
        }
        // DISCORD (V53)
        if (url.includes('discord.com/channels/')) {
           username = "Discord_User";
        }

        if (username) {
           window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'DISCOVERY', username }));
           if (scanTimer) clearInterval(scanTimer);
        }
      };
      scanTimer = setInterval(scan, 3000); // V53: FASTER SCAN
      true;
    })();
  `;

  const onMessage = (event: any) => {
     try {
       const data = JSON.parse(event.nativeEvent.data);
       if (data.type === 'DISCOVERY') {
         handleAutoSave(data.username);
       }
       // V49: CLEAR GLOBAL LOGIC ON SYNCED MESSAGE
       if (data.type === 'SYNCED') {
         setIsSyncing(false);
         setIsTransitioning(false);
         setPendingPlatform(null);
         setSyncPlatform(null);
       }
     } catch (e) {}
  };

  const uniqueLinks = useMemo(() => {
    const map = new Map();
    links.forEach(l => {
       const key = `${l.platform.toLowerCase()}_${l.username.toLowerCase()}`;
       if (!map.has(key)) map.set(key, l);
    });
    return Array.from(map.values());
  }, [links]);

  const TColors = THEMES[themeMode];
  const currentConfig = PLATFORMS_CONFIG[activePlatform.toLowerCase()] || PLATFORMS_CONFIG.home;

  return (
    <View style={[styles.container, { backgroundColor: TColors.bg }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { backgroundColor: TColors.header, borderBottomColor: TColors.border }]}>
           <View style={styles.brandRow}>
              <Image source={require('../../assets/branding/logo.png')} style={styles.brandLogo} />
              <Text style={[styles.brandName, { color: TColors.text }]}>SHORTKUT</Text>
           </View>
           <TouchableOpacity onPress={() => router.push('/settings')} style={[styles.headerAction, { backgroundColor: TColors.card }]}>
              <Feather name="settings" size={22} color={TColors.subText} />
           </TouchableOpacity>
        </View>

        <View style={styles.mainLayout}>
           <View style={styles.contentBoard}>
              {syncPlatform ? (
                 <View style={[styles.addPortalContainer, { backgroundColor: themeMode === 'dark' ? '#050A0F' : '#fff' }]}>
                    <View style={styles.portalNav}>
                       <TouchableOpacity onPress={() => setSyncPlatform(null)}><Feather name="arrow-left" size={24} color={TColors.text} /></TouchableOpacity>
                       <Text style={[styles.portalTitle, { color: TColors.text }]}>CONNECT {syncPlatform.toUpperCase()}</Text>
                       <View style={{ width: 24 }} />
                    </View>
                    <View style={styles.webviewWrapper}>
                       {isSyncing ? (
                          <View style={styles.syncOverlay}>
                             <ActivityIndicator size="large" color={TColors.accent} /><Text style={[styles.syncText, { color: TColors.accent }]}>SYNCING ACCOUNT...</Text>
                          </View>
                       ) : (
                          <WebView 
                            source={{ uri: PLATFORMS_CONFIG[syncPlatform.toLowerCase()].loginUri }} 
                            style={{ flex: 1, backgroundColor: TColors.bg }} 
                            injectedJavaScript={discoveryScript} 
                            onMessage={onMessage} 
                            userAgent="Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36"
                          />
                       )}
                    </View>
                 </View>
              ) : activeUri ? (
                <View style={styles.portalWrapper}>
                  <ChatPortal uri={activeUri} platform={activePlatform} username={activeUser || ''} color={currentConfig.color} theme={themeMode} linkId={activeLinkId || 'portal-default'} onClose={() => jumpWithLoading('home')} />
                </View>
              ) : isAddingMode ? (
                 <View style={styles.pickerView}>
                    <Text style={[styles.pickerTitle, { color: TColors.text }]}>PICK PLATFORM</Text>
                    <View style={styles.pickerGrid}>
                       {['Instagram', 'Facebook', 'Discord', 'Twitter', 'LinkedIn'].map(p => {
                          const isL = links.some(l => l.platform.toLowerCase() === p.toLowerCase());
                          return (
                            <TouchableOpacity key={p} style={styles.pickerItem} onPress={() => isL ? Alert.alert("SnapKut Hub", `Already linked ${p}!`) : handleStartSync(p)}>
                               <View style={[styles.pickerIconCircle, { backgroundColor: TColors.card }, isL && { opacity: 0.15 }]}>
                                  <Image source={PLATFORMS_CONFIG[p.toLowerCase()].localImage} style={styles.pickerIcon} />
                               </View>
                               <Text style={[styles.pickerLabel, { color: TColors.subText }, isL && { opacity: 0.3 }]}>{p}</Text>
                            </TouchableOpacity>
                          );
                       })}
                    </View>
                    <TouchableOpacity style={[styles.cancelBtn, { backgroundColor: TColors.card }]} onPress={() => setIsAddingMode(false)}><Text style={[styles.cancelText, { color: TColors.subText }]}>CANCEL</Text></TouchableOpacity>
                 </View>
              ) : (
                <View style={{ flex: 1 }}>
                   <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={TColors.accent} />}>
                      <View style={styles.homePanel}>
                         <View style={[styles.homeHero, { backgroundColor: `${TColors.accent}10` }]}><MaterialCommunityIcons name="remote" size={80} color={TColors.accent} /></View>
                         <Text style={[styles.homeHeroTitle, { color: TColors.text }]}>Terminal Hub</Text>
                         <Text style={[styles.homeHeroDesc, { color: TColors.subText }]}>All your remote controls in one high-velocity sidebar. No distractions, just messages.</Text>
                      </View>
                   </ScrollView>
                </View>
              )}
           </View>

           {!isSidebarHidden ? (
              <View style={[styles.sidebarRail, { borderLeftColor: TColors.border, backgroundColor: TColors.sidebar }]}>
                 <TouchableOpacity onPress={() => jumpWithLoading('home')} style={[styles.railItem, { backgroundColor: TColors.card }, activePlatform === 'home' && { backgroundColor: TColors.text }]}>
                    <Ionicons name={activePlatform === 'home' ? "home" : "home-outline"} size={22} color={activePlatform === 'home' ? TColors.bg : TColors.subText} />
                 </TouchableOpacity>
                 <View style={[styles.railDivider, { backgroundColor: TColors.border }]} />
                 <ScrollView showsVerticalScrollIndicator={false}>
                    {uniqueLinks.map((link: any) => {
                       const isActive = activePlatform === link.platform && activeUser === link.username;
                       return (
                          <TouchableOpacity key={link._id} onPress={() => jumpWithLoading(link.platform, link)} style={[styles.railItem, { backgroundColor: TColors.card }, isActive && { backgroundColor: TColors.text }]}>
                             <Image source={PLATFORMS_CONFIG[link.platform.toLowerCase()]?.localImage} style={{ width: 28, height: 28, borderRadius: 8, opacity: isActive ? 1 : 0.4 }} />
                          </TouchableOpacity>
                       );
                    })}
                    {pendingPlatform && <View style={[styles.railItem, { borderColor: TColors.accent, borderWidth: 1 }]}><Image source={PLATFORMS_CONFIG[pendingPlatform.toLowerCase()].localImage} style={{ width: 28, height: 28, borderRadius: 8, opacity: 0.2 }} /><ActivityIndicator size="small" color={TColors.text} style={{ position: 'absolute' }} /></View>}
                 </ScrollView>
                 <View style={[styles.railDivider, { backgroundColor: TColors.border }]} />
                 <TouchableOpacity onPress={() => jumpWithLoading('add_new')} style={[styles.railItem, isAddingMode && { backgroundColor: TColors.accent }]}>
                    <Feather name="plus" size={24} color={isAddingMode ? "#000" : TColors.accent} />
                 </TouchableOpacity>
                 <TouchableOpacity onPress={toggleSidebar} style={[styles.railItem, { marginTop: 'auto', backgroundColor: TColors.card }]}>
                    <Feather name="chevron-right" size={20} color={TColors.subText} />
                 </TouchableOpacity>
              </View>
           ) : (
              <TouchableOpacity onPress={toggleSidebar} style={[styles.stealthHandle, { backgroundColor: TColors.accent }]}>
                 <Feather name="chevron-left" size={18} color="#000" />
              </TouchableOpacity>
           )}
           
           {isTransitioning && <LoadingPortal theme={themeMode} />}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { height: 74, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderBottomWidth: 1 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandLogo: { width: 34, height: 34, borderRadius: 10 },
  brandName: { fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  headerAction: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  mainLayout: { flex: 1, flexDirection: 'row', position: 'relative' },
  contentBoard: { flex: 1 },
  sidebarRail: { width: 72, borderLeftWidth: 1, alignItems: 'center', paddingVertical: 20 },
  railItem: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  railDivider: { width: 30, height: 1, marginBottom: 12 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  homePanel: { alignItems: 'center', paddingVertical: 100 },
  homeHero: { width: 130, height: 130, borderRadius: 65, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  homeHeroTitle: { fontSize: 32, fontWeight: '900', marginBottom: 15 },
  homeHeroDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, paddingHorizontal: 40 },
  portalWrapper: { flex: 1 },
  addPortalContainer: { flex: 1, margin: 10, borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  portalNav: { flexDirection: 'row', padding: 15, alignItems: 'center', justifyContent: 'space-between' },
  portalTitle: { fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  webviewWrapper: { flex: 1, margin: 10, borderRadius: 20, overflow: 'hidden' },
  syncOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  syncText: { fontSize: 12, fontWeight: '900', marginTop: 15 },
  pickerView: { flex: 1, padding: 30, alignItems: 'center', justifyContent: 'center' },
  pickerTitle: { fontSize: 24, fontWeight: '900', marginBottom: 40 },
  pickerGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20 },
  pickerItem: { width: (width - 150) / 2, alignItems: 'center' },
  pickerIconCircle: { width: 70, height: 70, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  pickerIcon: { width: 44, height: 44 },
  pickerLabel: { fontSize: 11, fontWeight: '900' },
  cancelBtn: { marginTop: 40, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 15 },
  cancelText: { fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  stealthHandle: { position: 'absolute', right: 0, top: '50%', width: 24, height: 44, borderTopLeftRadius: 12, borderBottomLeftRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 5, zIndex: 101, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' }
});
