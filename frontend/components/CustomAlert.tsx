import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

interface CustomAlertProps {
  visible: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function CustomAlert({ 
  visible, 
  type, 
  title, 
  message, 
  onClose, 
  onConfirm, 
  confirmText, 
  cancelText 
}: CustomAlertProps) {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 10,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animation]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const iconName = type === 'success' ? 'checkmark-circle' : type === 'error' ? 'alert-circle' : 'information-circle' as any;
  const iconColor = type === 'success' ? '#3dfc3d' : type === 'error' ? '#ef4444' : '#3b82f6';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity }]}>
            <TouchableOpacity 
                activeOpacity={1} 
                style={styles.fullSize} 
                onPress={onClose} 
            />
        </Animated.View>
        
        <Animated.View style={[styles.alertContainer, { transform: [{ translateY }], opacity }]}>
          <BlurView intensity={Platform.OS === 'ios' ? 40 : 20} tint="dark" style={styles.blurBg}>
            <View style={styles.content}>
               <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
                  <Ionicons name={iconName} size={40} color={iconColor} />
               </View>
               
               <Text style={styles.title}>{title}</Text>
               <Text style={styles.message}>{message}</Text>
               
               <View style={styles.buttonContainer}>
                 {onConfirm && (
                   <TouchableOpacity 
                     style={[styles.button, styles.cancelButton]} 
                     onPress={onClose}
                   >
                     <Text style={styles.cancelButtonText}>{cancelText || 'Cancel'}</Text>
                   </TouchableOpacity>
                 )}
                 
                 <TouchableOpacity 
                   style={[styles.button, { 
                     backgroundColor: type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(61, 252, 61, 0.1)', 
                     borderColor: `${iconColor}40`,
                     flex: onConfirm ? 1 : 0,
                     width: onConfirm ? 'auto' : '100%' 
                   }]} 
                   onPress={onConfirm || onClose}
                 >
                   <Text style={[styles.buttonText, { color: iconColor }]}>
                     {onConfirm ? (confirmText || 'Logout') : 'OK'}
                   </Text>
                 </TouchableOpacity>
               </View>
            </View>
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  fullSize: {
    flex: 1,
  },
  alertContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: '#121212', // Fallback for BlurView
  },
  blurBg: {
    width: '100%',
  },
  content: {
    padding: 30,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cancelButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
