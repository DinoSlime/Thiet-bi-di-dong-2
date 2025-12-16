// File: app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#121212', // Màu nền đen
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#1DB954', // Màu xanh khi chọn
        tabBarInactiveTintColor: '#888',  // Màu xám khi không chọn
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          marginBottom: 2
        }
      }}>
      
      {/* 1. TRANG CHỦ */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />

      {/* 2. YÊU THÍCH */}
      <Tabs.Screen
        name="favorites" 
        options={{
          title: 'Yêu thích',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "heart" : "heart-outline"} size={24} color={color} />
          ),
        }}
      />

      {/* 3. TRANG TRỐNG (Để dành) */}
      <Tabs.Screen
        name="placeholder" 
        options={{
          title: 'Mở rộng', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "disc" : "disc-outline"} size={24} color={color} />
          ),
        }}
      />

      {/* 4. CÁ NHÂN */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />


    </Tabs>
  );
}