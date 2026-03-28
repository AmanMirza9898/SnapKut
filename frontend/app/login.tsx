import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#0a0a0a', '#121212']}
        style={styles.background}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <View style={styles.dashedCircle}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* Logo & Welcome */}
          <View style={styles.header}>
            <Text style={styles.logoText}>SNAPKUT</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Enter your details to continue your creative journey.</Text>
          </View>

          {/* Social Login Section */}
          <View style={styles.socialSection}>
            <TouchableOpacity style={[styles.socialBtn, styles.googleBtn]}>
              <Ionicons name="logo-google" size={24} color="#ea4335" />
              <Text style={styles.googleBtnText}>LOGIN WITH GOOGLE</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.socialBtn, styles.facebookBtn]}>
              <Ionicons name="logo-facebook" size={24} color="#fff" />
              <Text style={styles.facebookBtnText}>LOGIN WITH FACEBOOK</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>OR LOGIN WITH EMAIL</Text>
            <View style={styles.line} />
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#4b5563"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>PASSWORD</Text>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>FORGOT PASSWORD?</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="********"
                placeholderTextColor="#4b5563"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity 
                style={styles.signInBtn}
                onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.signInText}>SIGN IN</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backBtn: {
    marginBottom: 30,
    width: 50,
  },
  dashedCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  header: {
    marginBottom: 40,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#3dfc3d',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  socialSection: {
    gap: 15,
    marginBottom: 30,
  },
  socialBtn: {
    height: 60,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
  },
  googleBtn: {
    backgroundColor: '#fff',
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 0.5,
  },
  facebookBtn: {
    backgroundColor: '#1877f2',
    borderColor: '#1e40af',
  },
  facebookBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#1e293b',
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4b5563',
    letterSpacing: 1,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 10,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  forgotText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3dfc3d',
    letterSpacing: 0.5,
  },
  input: {
    height: 60,
    backgroundColor: '#111',
    borderRadius: 16,
    paddingHorizontal: 20,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  signInBtn: {
    backgroundColor: '#3dfc3d',
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3dfc3d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signInText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 1,
  },
});
