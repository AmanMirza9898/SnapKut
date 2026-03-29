import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#39FF14',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.2)',
        tabBarStyle: { display: 'none' }, // FULLY HIDE BOTTOM TAB BAR
        tabBarShowLabel: false,
        headerShown: false,
      }}>
      
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />

      {/* Hide Add Tab */}
      <Tabs.Screen
        name="add"
        options={{
          href: null,
        }}
      />

      {/* Hide Analytics Tab */}
      <Tabs.Screen
        name="two"
        options={{
          href: null,
        }}
      />

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, focused }) => (
             <Ionicons name={focused ? "settings" : "settings-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerFabContainer: {
    marginBottom: Platform.OS === 'ios' ? 25 : 35,
    padding: 10,
  },
  centerFabBody: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#39FF14',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#000',
  },
});
