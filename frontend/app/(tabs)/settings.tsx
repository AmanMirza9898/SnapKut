import React, { useState, useCallback, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  Image,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL } from '@/constants/Config';
import CustomAlert from '../../components/CustomAlert';
import { WebView } from 'react-native-webview'; // V48

const { width } = Dimensions.get('window');

// V27 THEME COLORS
const THEMES: any = {
  dark: {
    bg: '#050A0F', 
    card: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.06)',
    text: '#fff',
    subText: 'rgba(255,255,255,0.4)',
    accent: '#58CCFF', 
    header: '#050A0F',
  },
  light: {
    bg: '#f8f9fa',
    card: '#ffffff',
    border: 'rgba(0,0,0,0.05)',
    text: '#1a1a1b',
    subText: 'rgba(0,0,0,0.4)',
    accent: '#00A86B',
    header: '#ffffff',
  }
};

const PLATFORMS_ICON: any = {
  instagram: { icon: 'instagram', color: '#E1306C', localImage: require('../../assets/branding/instagram.png'), logoutUri: 'https://www.instagram.com/accounts/logout/' },
  facebook: { icon: 'facebook', color: '#1877F2', localImage: require('../../assets/branding/facebook.png'), logoutUri: 'https://m.facebook.com/logout.php' },
  discord: { icon: 'discord', color: '#5865F2', localImage: require('../../assets/branding/discord.png'), logoutUri: 'https://discord.com/logout' },
  twitter: { icon: 'twitter', color: '#ffffff', localImage: require('../../assets/branding/twitter.png'), logoutUri: 'https://x.com/logout' },
  linkedin: { icon: 'linkedin', color: '#0077B5', localImage: require('../../assets/branding/linkedin.png'), logoutUri: 'https://www.linkedin.com/logout' },
};

export default function SettingsScreen() {
  const router = useRouter();
  const [links, setLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logoutAlert, setLogoutAlert] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [user, setUser] = useState<any>(null); // V54
  
  // V48 SECURE UNLINK
  const [isTerminating, setIsTerminating] = useState(false);
  const [terminatingUri, setTerminatingUri] = useState<string | null>(null);

  // Load Prefs
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const savedT = await AsyncStorage.getItem('themeMode');
        const savedS = await AsyncStorage.getItem('isSidebarHidden');
        const savedU = await AsyncStorage.getItem('user');
        if (savedT === 'light' || savedT === 'dark') setThemeMode(savedT);
        setIsSidebarHidden(savedS === 'true');
        if (savedU) setUser(JSON.parse(savedU));
      })();
    }, [])
  );

  const toggleSidebar = async () => {
    const next = !isSidebarHidden;
    setIsSidebarHidden(next);
    await AsyncStorage.setItem('isSidebarHidden', next.toString());
  };

  const fetchLinks = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/links/get`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setLinks(data.links || []);
      }
    } catch (error) {
      console.error('Fetch links error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLinks();
    }, [fetchLinks])
  );

  const toggleTheme = async () => {
    const next = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(next);
    await AsyncStorage.setItem('themeMode', next);
  };

  const handleUnlink = async (id: string, platform: string) => {
    const config = PLATFORMS_ICON[platform.toLowerCase()];
    Alert.alert(
      "Secure Unlink",
      `Are you sure you want to remove ${platform}? This will also terminate your current session for privacy.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Unlink & Logout", 
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              const token = await AsyncStorage.getItem('token');
              // 1. Delete Link from DB
              const response = await fetch(`${API_URL}/links/delete?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
              });
              
              if (response.ok) {
                // 2. Force Session Termination (V48)
                if (config?.logoutUri) {
                  setTerminatingUri(config.logoutUri);
                  setIsTerminating(true);
                  // Wait for session cleanup (4 seconds)
                  setTimeout(() => {
                    setIsTerminating(false);
                    setTerminatingUri(null);
                    fetchLinks();
                  }, 4000);
                } else {
                  fetchLinks();
                }
              }
            } catch (error) {
              console.error('Delete error:', error);
            } finally {
              if (!isTerminating) setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    setLogoutAlert(true);
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.clear();
      setLogoutAlert(false);
      router.replace('/onboarding');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const T = THEMES[themeMode];

  return (
    <View style={[styles.container, { backgroundColor: T.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: T.header, borderBottomColor: T.border }]}>
         <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={T.text} />
         </TouchableOpacity>
         <Text style={[styles.headerTitle, { color: T.text }]}>Settings</Text>
         <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* V54: USER PROFILE CARD */}
        {user && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: T.subText }]}>Authorized Profile</Text>
            <View style={[styles.profileCard, { backgroundColor: T.card, borderColor: T.border }]}>
               <View style={[styles.avatarCircle, { backgroundColor: T.accent }]}>
                  <Text style={styles.avatarText}>{user.name?.charAt(0).toUpperCase() || 'U'}</Text>
               </View>
               <View style={styles.profileMeta}>
                  <Text style={[styles.profileName, { color: T.text }]}>{user.name || 'ShortKut User'}</Text>
                  <Text style={[styles.profileEmail, { color: T.subText }]}>{user.email || 'No email'}</Text>
               </View>
               <View style={styles.badge}>
                  <Text style={styles.badgeText}>PRO</Text>
               </View>
            </View>
          </View>
        )}

        {/* Connected Accounts Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: T.subText }]}>Connected Channels</Text>
          <View style={[styles.card, { backgroundColor: T.card, borderColor: T.border }]}>
            {isLoading ? (
               <ActivityIndicator color={T.accent} style={{ padding: 20 }} />
            ) : links.length > 0 ? (
              links.map((link, index) => {
                 const config = PLATFORMS_ICON[link.platform.toLowerCase()] || { icon: 'link', color: '#fff' };
                 return (
                   <View key={link._id} style={[styles.accountItem, index !== links.length -1 && { borderBottomWidth: 1, borderBottomColor: T.border }]}>
                      <View style={styles.platformIcon}>
                         <Image source={config.localImage} style={{ width: 32, height: 32 }} />
                      </View>
                      <View style={styles.meta}>
                         <Text style={[styles.platformName, { color: T.text }]}>{link.platform}</Text>
                         <Text style={[styles.username, { color: T.subText }]}>@{link.username}</Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => handleUnlink(link._id, link.platform)}
                        style={styles.unlinkBtn}
                      >
                         <Text style={styles.unlinkText}>Unlink</Text>
                      </TouchableOpacity>
                   </View>
                 );
              })
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="link-outline" size={32} color={T.border} />
                <Text style={[styles.emptyText, { color: T.subText }]}>No accounts connected yet</Text>
              </View>
            )}
          </View>
        </View>

        {/* System Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: T.subText }]}>Visual Style</Text>
          <View style={[styles.card, { backgroundColor: T.card, borderColor: T.border }]}>
             <TouchableOpacity onPress={toggleTheme} style={styles.settingRow}>
                <Feather name={themeMode === 'dark' ? "moon" : "sun"} size={20} color={T.subText} />
                <Text style={[styles.settingLabel, { color: T.text }]}>{themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}</Text>
                <View style={[styles.toggle, { backgroundColor: themeMode === 'dark' ? '#222' : '#eee' }]}>
                   <View style={[styles.toggleCircle, { backgroundColor: T.accent, alignSelf: themeMode === 'dark' ? 'flex-end' : 'flex-start' }]} />
                </View>
             </TouchableOpacity>
          </View>
        </View>

        {/* Global Reset */}
        <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: T.text }]} onPress={handleLogout}>
           <Text style={[styles.logoutText, { color: T.bg }]}>LOGOUT</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
           <Text style={[styles.versionText, { color: T.subText }]}>ShortKut V48 - Private Entry Edition</Text>
        </View>

      </ScrollView>

      {/* V48: FORCE LOGOUT SEQUENCE OVERLAY */}
      {isTerminating && (
        <View style={styles.terminationOverlay}>
           <ActivityIndicator size="large" color="#58CCFF" />
           <Text style={styles.terminationText}>TERMINATING SECURE SESSION...</Text>
           <Text style={styles.terminationSub}>Clearing session cookies for your safety.</Text>
           {terminatingUri && (
             <View style={{ width: 1, height: 1, opacity: 0 }}>
               <WebView source={{ uri: terminatingUri }} style={{ width: 1, height: 1 }} />
             </View>
           )}
        </View>
      )}

      <CustomAlert
        visible={logoutAlert}
        type="error"
        title="Logout Session"
        message="Are you sure you want to terminate your current secure session?"
        onClose={() => setLogoutAlert(false)}
        onConfirm={confirmLogout}
        confirmText="Logout"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  scrollContent: { padding: 25, paddingBottom: 120 },
  section: { marginBottom: 35 },
  sectionLabel: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 15, paddingLeft: 5 },
  card: { borderRadius: 24, borderWidth: 1, overflow: 'hidden' },
  accountItem: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  platformIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  meta: { flex: 1, marginLeft: 15 },
  platformName: { fontSize: 14, fontWeight: '900' },
  username: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  unlinkBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,68,68,0.05)' },
  unlinkText: { color: '#ff4444', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 15 },
  settingLabel: { flex: 1, fontSize: 14, fontWeight: '800' },
  toggle: { width: 40, height: 22, borderRadius: 11, padding: 2 },
  toggleCircle: { width: 18, height: 18, borderRadius: 9 },
  logoutBtn: { height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  logoutText: { fontSize: 14, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2 },
  emptyState: { padding: 30, alignItems: 'center', gap: 10 },
  emptyText: { fontSize: 12, fontWeight: '700' },
  footer: { marginTop: 40, alignItems: 'center' },
  versionText: { fontSize: 10, fontWeight: '800', opacity: 0.3 },
  terminationOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(5, 10, 15, 0.95)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  terminationText: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 2, marginTop: 20 },
  terminationSub: { color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 5 },
  profileCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 24, borderWidth: 1 },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#000', fontSize: 18, fontWeight: '900' },
  profileMeta: { flex: 1, marginLeft: 15 },
  profileName: { fontSize: 16, fontWeight: '900' },
  profileEmail: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  badge: { backgroundColor: 'rgba(88, 204, 255, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: '#58CCFF', fontSize: 8, fontWeight: '900' },
});
