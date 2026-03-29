import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/Config';
import CustomAlert from '../components/CustomAlert';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
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

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('error', 'Hold up!', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        router.replace('/(tabs)');
      } else {
        showAlert('error', 'Access Denied', data.error || 'Invalid credentials.');
      }
    } catch (error) {
      showAlert('error', 'Connection Error', 'Could not connect to the terminal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#050A0F', '#0D1B2A']}
        style={styles.background}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Logo & Welcome */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Image source={require('../assets/branding/logo.png')} style={styles.logoIcon} />
              <Text style={styles.brandText}>SHORTKUT</Text>
            </View>
            <Text style={styles.title}>Secure Login</Text>
            <Text style={styles.subtitle}>Enter your credentials to access your high-velocity hub.</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
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

            {/* Sign In Button */}
            <TouchableOpacity 
                activeOpacity={0.8}
                style={styles.signInBtn}
                onPress={handleLogin}
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
                    <Text style={styles.signInText}>LOGIN</Text>
                    <Ionicons name="key" size={18} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push('/register')}
              style={styles.noAccountBtn}
            >
              <Text style={styles.noAccountText}>NEW TO SHORTKUT? <Text style={styles.registerLink}>CREATE ACCOUNT</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      <CustomAlert 
        visible={alertVisible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertVisible(false)}
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
  header: { marginBottom: 40 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  logoIcon: { width: 34, height: 34 },
  brandText: { fontSize: 24, fontWeight: '900', color: '#fff', letterSpacing: 4 },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 10 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 22 },
  form: { gap: 25 },
  inputGroup: { gap: 10 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.3)', letterSpacing: 2 },
  forgotText: { fontSize: 10, fontWeight: '900', color: '#58CCFF' },
  input: { height: 64, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, paddingHorizontal: 20, color: '#fff', fontSize: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  passwordInputContainer: { flexDirection: 'row', alignItems: 'center', height: 64, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 15 },
  flexInput: { flex: 1, color: '#fff', fontSize: 15, height: '100%', paddingLeft: 5 },
  eyeBtn: { padding: 5 },
  signInBtn: { height: 64, borderRadius: 20, overflow: 'hidden', marginTop: 10, shadowColor: '#A044FF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15 },
  btnGradient: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  signInText: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  noAccountBtn: { marginTop: 10, alignItems: 'center' },
  noAccountText: { fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: '700' },
  registerLink: { color: '#58CCFF', fontWeight: '900' }
});
