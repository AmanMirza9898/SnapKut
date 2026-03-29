import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { API_URL } from '@/constants/Config';
import CustomAlert from '../components/CustomAlert';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // V47
  const [loading, setLoading] = useState(false);
  
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    onClose?: () => void;
  }>({
    type: 'error',
    title: '',
    message: ''
  });

  const showAlert = (type: 'success' | 'error' | 'info', title: string, message: string, onClose?: () => void) => {
    setAlertConfig({ type, title, message, onClose });
    setAlertVisible(true);
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      showAlert('error', 'Hold up!', 'Please fill all fields to create your hub profile.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        showAlert('success', 'Profile Created', 'Your ShortKut terminal is ready. Please LOGIN now.', () => {
          router.push('/login');
        });
      } else {
        showAlert('error', 'Registration Error', data.error || 'Failed to create account.');
      }
    } catch (error) {
      showAlert('error', 'Connection Refused', 'Could not establish connection to the hub.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.background}>
        <LinearGradient colors={['#050A0F', '#0D1B2A']} style={styles.background} />
      </View>
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Image source={require('../assets/branding/logo.png')} style={styles.logoIcon} />
              <Text style={styles.brandText}>SHORTKUT</Text>
            </View>
            <Text style={styles.title}>Join the Hub</Text>
            <Text style={styles.subtitle}>Create your profile to start managing all your socials in one place.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FULL NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="Aman Mirza"
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>PASSWORD</Text>
              </View>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.flexInput}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="rgba(255,255,255,0.3)" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              activeOpacity={0.8}
              style={styles.registerBtn} 
              onPress={handleRegister}
              disabled={loading}
            >
              <LinearGradient
                colors={['#58CCFF', '#A044FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.registerText}>SIGNUP</Text>
                    <Ionicons name="rocket" size={18} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/login')}>
              <Text style={styles.loginLinkText}>
                ALREADY ENROLLED? <Text style={styles.loginLinkHighlight}>LOG IN HERE</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      <CustomAlert 
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => {
          setAlertVisible(false);
          if (alertConfig.onClose) alertConfig.onClose();
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { ...StyleSheet.absoluteFillObject },
  safeArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 30, paddingTop: 20, paddingBottom: 40 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  header: { marginBottom: 35 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  logoIcon: { width: 34, height: 34 },
  brandText: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 4 },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 22 },
  form: { gap: 20 },
  inputGroup: { gap: 10 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.3)', letterSpacing: 2 },
  input: { height: 64, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, paddingHorizontal: 20, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  passwordInputContainer: { flexDirection: 'row', alignItems: 'center', height: 64, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 15 },
  flexInput: { flex: 1, color: '#fff', fontSize: 15, height: '100%', paddingLeft: 5 },
  eyeBtn: { padding: 5 },
  registerBtn: { height: 64, borderRadius: 20, overflow: 'hidden', marginTop: 10, shadowColor: '#A044FF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15 },
  btnGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  registerText: { fontSize: 14, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  loginLink: { marginTop: 10, alignItems: 'center' },
  loginLinkText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '700' },
  loginLinkHighlight: { color: '#58CCFF', fontWeight: '900' },
});
